"""
SENTINEL // EDR — Enterprise Authentication & Session Management Module
Provides secure SQLite database persistence, bcrypt password hashing,
session lifecycle management, role-based user profiles, and single-use time-limited reset tokens.
"""

import os
import sqlite3
import datetime
import secrets
import re
from typing import Optional, Dict, Any
from contextlib import contextmanager

from fastapi import APIRouter, HTTPException, Depends, Header, status
from pydantic import BaseModel, Field, EmailStr
import bcrypt

# -----------------------------------------------------------------------------
# Database Configuration & Initialization
# -----------------------------------------------------------------------------

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(BASE_DIR, "backend", "data")
os.makedirs(DATA_DIR, exist_ok=True)
DB_PATH = os.path.join(DATA_DIR, "sentinel_auth.db")

@contextmanager
def get_db():
    """Provides a thread-safe connection to the SQLite database."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    # Enable WAL mode for high concurrency
    conn.execute("PRAGMA journal_mode = WAL;")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_auth_db():
    """Initializes tables and seeds the default administrator account."""
    with get_db() as conn:
        # 1. Users Table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'SOC Security Analyst',
                department TEXT DEFAULT 'Cyber Defense Operations',
                created_at TEXT NOT NULL,
                last_login TEXT
            );
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);")

        # 2. Sessions Table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                is_revoked INTEGER DEFAULT 0,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);")

        # 3. Password Resets Table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS password_resets (
                token TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                used INTEGER DEFAULT 0,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_resets_token ON password_resets(token);")

        # 4. Seed Default Admin if not existing
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = ?", ("admin@sentinel.defense",))
        if not cursor.fetchone():
            admin_id = f"USR-{secrets.token_hex(4).upper()}"
            salt = bcrypt.gensalt(rounds=12)
            hashed = bcrypt.hashpw(b"Sentinel@2026!", salt).decode('utf-8')
            now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
            cursor.execute("""
                INSERT INTO users (id, email, full_name, password_hash, role, department, created_at, last_login)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                admin_id,
                "admin@sentinel.defense",
                "Chief Information Security Officer",
                hashed,
                "SOC Lead Architect",
                "Zero-Day Threat Defense Group",
                now_iso,
                now_iso
            ))
            print(f"[Sentinel Auth] Initialized authentication database and seeded admin account: admin@sentinel.defense")

# Run DB initialization immediately on module import
init_auth_db()


# -----------------------------------------------------------------------------
# Cryptographic & Password Helpers
# -----------------------------------------------------------------------------

def hash_password(password: str) -> str:
    """Hashes a plain-text password using salted bcrypt with 12 rounds."""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain-text password against a stored bcrypt hash."""
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def generate_session_token() -> str:
    """Generates a high-entropy cryptographically secure random session token."""
    return f"stk_{secrets.token_urlsafe(48)}"

def generate_reset_token() -> str:
    """Generates a single-use secure reset token."""
    return f"rst_{secrets.token_urlsafe(32)}"


# -----------------------------------------------------------------------------
# Request & Response Schemas
# -----------------------------------------------------------------------------

class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=150)
    password: str = Field(..., min_length=8, max_length=128)
    department: Optional[str] = "Cyber Defense Operations"

class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = False

class ForgotPasswordRequest(BaseModel):
    email: str

class VerifyResetTokenRequest(BaseModel):
    token: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)

class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    department: str
    created_at: str
    last_login: Optional[str] = None


# -----------------------------------------------------------------------------
# Dependency: Extract & Validate Authenticated User
# -----------------------------------------------------------------------------

def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    Extracts the Bearer token from the Authorization header,
    validates the session against the SQLite database,
    and returns the authenticated user's dictionary.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication credentials. Please log in."
        )

    token = authorization.split("Bearer ", 1)[1].strip()
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT s.token, s.user_id, s.expires_at, s.is_revoked,
                   u.id, u.email, u.full_name, u.role, u.department, u.created_at, u.last_login
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.token = ? AND s.is_revoked = 0
        """, (token,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session has expired or was revoked. Please log in again."
            )

        # Check expiration
        if row["expires_at"] < now_iso:
            # Mark expired session as revoked
            conn.execute("UPDATE sessions SET is_revoked = 1 WHERE token = ?", (token,))
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Your session has expired. Please log in again."
            )

        return {
            "id": row["id"],
            "email": row["email"],
            "full_name": row["full_name"],
            "role": row["role"],
            "department": row["department"],
            "created_at": row["created_at"],
            "last_login": row["last_login"],
            "token": token
        }


# -----------------------------------------------------------------------------
# Router Definition & Endpoints
# -----------------------------------------------------------------------------

router = APIRouter(prefix="/api/auth", tags=["Enterprise Authentication"])

@router.post("/register")
def register(payload: RegisterRequest):
    """
    Registers a new security analyst account in the SENTINEL EDR database.
    Performs email normalization, password complexity validation, and bcrypt hashing.
    Immediately issues a valid session token upon successful registration.
    """
    clean_email = payload.email.strip().lower()
    clean_name = payload.full_name.strip()

    # Email format validation
    if not re.match(r"[^@]+@[^@]+\.[^@]+", clean_email):
        raise HTTPException(status_code=400, detail="Please provide a valid email address.")

    # Password complexity check
    if len(payload.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")
    if not re.search(r"[A-Za-z]", payload.password) or not re.search(r"[0-9!@#$%^&*(),.?\":{}|<>]", payload.password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one letter and one number or special character."
        )

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = ?", (clean_email,))
        if cursor.fetchone():
            raise HTTPException(
                status_code=400,
                detail="An analyst account with this email address already exists. Please log in instead."
            )

        user_id = f"USR-{secrets.token_hex(4).upper()}"
        pwd_hash = hash_password(payload.password)
        now_dt = datetime.datetime.now(datetime.timezone.utc)
        now_iso = now_dt.isoformat()

        # Insert user
        cursor.execute("""
            INSERT INTO users (id, email, full_name, password_hash, role, department, created_at, last_login)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id,
            clean_email,
            clean_name,
            pwd_hash,
            "SOC Security Analyst",
            payload.department or "Cyber Defense Operations",
            now_iso,
            now_iso
        ))

        # Issue active session token (7 days duration)
        token = generate_session_token()
        expires_at = (now_dt + datetime.timedelta(days=7)).isoformat()
        cursor.execute("""
            INSERT INTO sessions (token, user_id, created_at, expires_at, is_revoked)
            VALUES (?, ?, ?, ?, 0)
        """, (token, user_id, now_iso, expires_at))

    return {
        "success": True,
        "message": "Account created and authenticated successfully.",
        "token": token,
        "user": {
            "id": user_id,
            "email": clean_email,
            "full_name": clean_name,
            "role": "SOC Security Analyst",
            "department": payload.department or "Cyber Defense Operations",
            "created_at": now_iso,
            "last_login": now_iso
        }
    }


@router.post("/login")
def login(payload: LoginRequest):
    """
    Authenticates a user against stored bcrypt password hashes.
    Updates last_login and provisions a new session token.
    Supports extended 30-day persistence when remember_me is enabled.
    """
    clean_email = payload.email.strip().lower()

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, email, full_name, password_hash, role, department, created_at
            FROM users
            WHERE email = ?
        """, (clean_email,))
        user = cursor.fetchone()

        if not user or not verify_password(payload.password, user["password_hash"]):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password. Please verify your credentials and try again."
            )

        user_id = user["id"]
        now_dt = datetime.datetime.now(datetime.timezone.utc)
        now_iso = now_dt.isoformat()

        # Update last login
        conn.execute("UPDATE users SET last_login = ? WHERE id = ?", (now_iso, user_id))

        # Issue session token: 30 days if remember_me, else 7 days
        days = 30 if payload.remember_me else 7
        expires_at = (now_dt + datetime.timedelta(days=days)).isoformat()
        token = generate_session_token()

        conn.execute("""
            INSERT INTO sessions (token, user_id, created_at, expires_at, is_revoked)
            VALUES (?, ?, ?, ?, 0)
        """, (token, user_id, now_iso, expires_at))

    return {
        "success": True,
        "message": "Authentication successful.",
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "department": user["department"],
            "created_at": user["created_at"],
            "last_login": now_iso
        }
    }


@router.get("/me")
def get_my_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Protected route: returns the authenticated user's profile directly
    from the validated database session.
    """
    return {
        "authenticated": True,
        "user": {
            "id": current_user["id"],
            "email": current_user["email"],
            "full_name": current_user["full_name"],
            "role": current_user["role"],
            "department": current_user["department"],
            "created_at": current_user["created_at"],
            "last_login": current_user["last_login"]
        }
    }


@router.post("/logout")
def logout(authorization: Optional[str] = Header(None)):
    """
    Terminates the user session by marking the token as revoked in the database.
    Guarantees the session cannot be reused.
    """
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ", 1)[1].strip()
        with get_db() as conn:
            conn.execute("UPDATE sessions SET is_revoked = 1 WHERE token = ?", (token,))

    return {
        "success": True,
        "message": "Session successfully invalidated and logged out."
    }


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest):
    """
    Initiates password recovery for an analyst account.
    Generates a secure, time-limited, single-use reset token (15-minute TTL).
    """
    clean_email = payload.email.strip().lower()

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, full_name, email FROM users WHERE email = ?", (clean_email,))
        user = cursor.fetchone()

        if not user:
            # For security and user clarity, return friendly response
            raise HTTPException(
                status_code=404,
                detail="No account registered under this email address."
            )

        user_id = user["id"]
        # Invalidate any prior unused reset tokens for this user
        conn.execute("UPDATE password_resets SET used = 1 WHERE user_id = ?", (user_id,))

        now_dt = datetime.datetime.now(datetime.timezone.utc)
        now_iso = now_dt.isoformat()
        # 15 minutes TTL
        expires_at = (now_dt + datetime.timedelta(minutes=15)).isoformat()
        reset_token = generate_reset_token()

        conn.execute("""
            INSERT INTO password_resets (token, user_id, created_at, expires_at, used)
            VALUES (?, ?, ?, ?, 0)
        """, (reset_token, user_id, now_iso, expires_at))

    return {
        "success": True,
        "message": "Password reset token generated successfully. Valid for 15 minutes.",
        "reset_token": reset_token,
        "email": clean_email,
        "expires_in_minutes": 15
    }


@router.post("/verify-reset-token")
def verify_reset_token(payload: VerifyResetTokenRequest):
    """
    Verifies that a reset token is valid, unused, and within its 15-minute validity window.
    """
    token = payload.token.strip()
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT r.token, r.user_id, r.expires_at, r.used, u.email, u.full_name
            FROM password_resets r
            JOIN users u ON r.user_id = u.id
            WHERE r.token = ?
        """, (token,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=400, detail="Invalid password reset token.")
        if row["used"] == 1:
            raise HTTPException(status_code=400, detail="This reset token has already been used.")
        if row["expires_at"] < now_iso:
            raise HTTPException(status_code=400, detail="This password reset token has expired. Please request a new one.")

        return {
            "valid": True,
            "email": row["email"],
            "full_name": row["full_name"]
        }


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest):
    """
    Consumes a single-use reset token and updates the user's password with new bcrypt hash.
    Revokes all prior active sessions for security so the user must log in with their new password.
    """
    token = payload.token.strip()
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters long.")
    if not re.search(r"[A-Za-z]", payload.new_password) or not re.search(r"[0-9!@#$%^&*(),.?\":{}|<>]", payload.new_password):
        raise HTTPException(
            status_code=400,
            detail="New password must contain at least one letter and one number or special character."
        )

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT r.token, r.user_id, r.expires_at, r.used, u.email
            FROM password_resets r
            JOIN users u ON r.user_id = u.id
            WHERE r.token = ?
        """, (token,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=400, detail="Invalid password reset token.")
        if row["used"] == 1:
            raise HTTPException(status_code=400, detail="This reset token has already been used.")
        if row["expires_at"] < now_iso:
            raise HTTPException(status_code=400, detail="This password reset token has expired. Please request a new one.")

        user_id = row["user_id"]
        new_pwd_hash = hash_password(payload.new_password)

        # 1. Update password
        conn.execute("UPDATE users SET password_hash = ? WHERE id = ?", (new_pwd_hash, user_id))

        # 2. Mark token as used (single-use constraint)
        conn.execute("UPDATE password_resets SET used = 1 WHERE token = ?", (token,))

        # 3. Revoke all active sessions for this user for security
        conn.execute("UPDATE sessions SET is_revoked = 1 WHERE user_id = ?", (user_id,))

    return {
        "success": True,
        "message": "Password has been successfully updated. You may now log in with your new password."
    }
