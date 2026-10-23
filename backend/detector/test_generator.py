"""
Sentinel EDR - Safe Test Behavior Generator
Produces safe, controlled benign and suspicious file activity inside EDR_Test/
to test real-time behavioral detection without using malware or dangerous code.
"""

import os
import time
import random
import string
import asyncio
from typing import Dict, Any

class TestBehaviorGenerator:
    def __init__(self, target_dir: str):
        self.target_dir = os.path.abspath(target_dir)
        self.documents_dir = os.path.join(self.target_dir, "Documents")
        self.testfiles_dir = os.path.join(self.target_dir, "TestFiles")
        self.images_dir = os.path.join(self.target_dir, "Images")
        self.decoy_dir = os.path.join(self.target_dir, "Decoy")
        
        # Ensure directories exist
        for d in [self.documents_dir, self.testfiles_dir, self.images_dir, self.decoy_dir]:
            os.makedirs(d, exist_ok=True)

    def run_normal_file_modification(self) -> str:
        """Scenario 1: Single benign file modification (Expected: Normal, Risk < 25)."""
        target = os.path.join(self.documents_dir, "memo.txt")
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        with open(target, "a", encoding="utf-8") as f:
            f.write(f"\n[Benign Update - {timestamp}] Reviewed executive notes.")
        return target

    def run_multiple_file_modifications(self, count: int = 6) -> list:
        """Scenario 2: Moderate file modifications (Expected: Suspicious / Watch, Risk 35-50)."""
        modified = []
        for i in range(count):
            path = os.path.join(self.testfiles_dir, f"test_record_{i}.txt")
            with open(path, "w", encoding="utf-8") as f:
                f.write(f"Sample data chunk {i} - Timestamp: {time.time()}\n")
            modified.append(path)
            time.sleep(0.08)
        return modified

    def run_decoy_access(self) -> str:
        """Scenario 3: Single decoy access attempt (Expected: Suspicious, Risk 35-50)."""
        decoy_path = os.path.join(self.decoy_dir, "confidential.txt")
        if os.path.exists(decoy_path):
            with open(decoy_path, "a", encoding="utf-8") as f:
                f.write(f"\n[Unauthorized Probe: {time.time()}]")
        return decoy_path

    async def run_suspicious_zero_day_burst(self, num_files: int = 18) -> Dict[str, Any]:
        """
        Scenario 4: Combined Anomaly (Zero-Day Style Behavior):
        - Rapid mass modifications across multiple folders
        - Rapid rate (> 15 ops/sec)
        - High-entropy pseudorandom buffer writes (simulating encryption)
        - Decoy honeypot tripwire access
        Expected: CRITICAL (Risk >= 85), Containment triggered.
        """
        sim_pid = random.randint(4800, 4999)
        modified_paths = []

        # 1. Rapid modifications in TestFiles/
        for i in range(num_files):
            p = os.path.join(self.testfiles_dir, f"batch_payload_{i:02d}.dat")
            # Write pseudorandom bytes (High Shannon Entropy ~ 7.8)
            random_bytes = os.urandom(2048)
            with open(p, "wb") as f:
                f.write(random_bytes)
            modified_paths.append(p)
            await asyncio.sleep(0.03)

        # 2. Touch Documents/ folder (Multiple directories signal)
        doc_path = os.path.join(self.documents_dir, "encrypted_draft.dat")
        with open(doc_path, "wb") as f:
            f.write(os.urandom(1024))
        modified_paths.append(doc_path)

        # 3. Touch protected Decoy file (Critical Deception signal)
        decoy_target = os.path.join(self.decoy_dir, "financial_report.docx")
        if os.path.exists(decoy_target):
            with open(decoy_target, "ab") as f:
                f.write(b"\n[SUSPICIOUS_WRITE_BURST_ENCRYPT_HEADER_0x99]" + os.urandom(512))
        modified_paths.append(decoy_target)

        return {
            "sim_pid": sim_pid,
            "modified_count": len(modified_paths),
            "decoy_target": decoy_target,
            "paths": modified_paths
        }
