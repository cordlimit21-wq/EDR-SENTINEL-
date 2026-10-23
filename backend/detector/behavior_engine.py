"""
Sentinel EDR - Behavior Analysis Engine
Calculates multi-signal risk scores and flags zero-day anomalies based on process behavior.
"""

from typing import Dict, List, Tuple, Any, Optional

class BehaviorEngine:
    def __init__(self, containment_mode: str = "detection_only"):
        """
        containment_mode: 'detection_only' (safe default) | 'detection_and_containment'
        """
        self.containment_mode = containment_mode
        # Configurable signal weights
        self.weights = {
            "mass_mod_low": 15,       # > 5 files
            "mass_mod_medium": 25,    # > 15 files
            "mass_mod_high": 35,      # > 30 files
            "rapid_rate": 20,         # > 8 ops/sec
            "decoy_accessed": 35,     # Touched protected honeypot
            "multiple_dirs": 10,      # > 1 directory
            "high_entropy": 10        # Buffer entropy > 7.00
        }

    def evaluate_process_behavior(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluate aggregated activity window metrics and generate behavioral score and classification.
        """
        score = 0
        reasons: List[str] = []
        indicators: List[str] = []

        files_count = metrics.get("unique_files_count", 0)
        ops_rate = metrics.get("ops_per_second", 0.0)
        dirs_count = metrics.get("unique_dirs_count", 0)
        decoys_count = metrics.get("decoy_accessed_count", 0)
        max_entropy = metrics.get("max_entropy", 4.0)
        decoy_files = metrics.get("decoy_files", [])

        # 1. Mass file modifications
        if files_count >= 30:
            score += self.weights["mass_mod_high"]
            reasons.append(f"High-volume mass file modifications ({files_count} files)")
            indicators.append("Mass file modification")
        elif files_count >= 15:
            score += self.weights["mass_mod_medium"]
            reasons.append(f"Significant batch file modification ({files_count} files)")
            indicators.append("Multiple files affected")
        elif files_count >= 5:
            score += self.weights["mass_mod_low"]
            reasons.append(f"Moderate file modification burst ({files_count} files)")

        # 2. Rapid modification frequency
        if ops_rate >= 8.0:
            score += self.weights["rapid_rate"]
            reasons.append(f"Rapid file activity rate ({ops_rate} ops/sec)")
            indicators.append("Rapid file modification")

        # 3. Decoy canary honeypot interaction (Critical behavioral signal)
        if decoys_count > 0:
            score += self.weights["decoy_accessed"]
            decoy_names = [f.split('\\')[-1].split('/')[-1] for f in decoy_files]
            reasons.append(f"Protected decoy file accessed: {', '.join(decoy_names[:2])}")
            indicators.append("Decoy file accessed")

        # 4. Multiple directories affected
        if dirs_count > 1:
            score += self.weights["multiple_dirs"]
            reasons.append(f"Directory traversal spanning {dirs_count} distinct directories")
            indicators.append("Multiple directories affected")

        # 5. Shannon buffer entropy (Ransomware encryption heuristic)
        if max_entropy >= 7.0:
            score += self.weights["high_entropy"]
            reasons.append(f"Elevated buffer entropy (H = {max_entropy} / 8.00)")
            indicators.append("High entropy write")

        # Clamp score between 0 and 100
        score = min(100, max(0, score))

        # Classification mapping
        # 0–29: Normal
        # 30–59: Suspicious
        # 60–79: High Risk
        # 80–100: Critical
        if score >= 80:
            classification = "CRITICAL"
            severity = "CRITICAL_KILL"
            state = "THREAT_DETECTED"
        elif score >= 60:
            classification = "HIGH_RISK"
            severity = "WARNING"
            state = "HIGH_RISK"
        elif score >= 30:
            classification = "SUSPICIOUS"
            severity = "WARNING"
            state = "SUSPICIOUS_ACTIVITY"
        else:
            classification = "NORMAL"
            severity = "INFO"
            state = "MONITORING"

        # Determine containment recommendation
        should_contain = score >= 80
        action = "ALLOWED"
        if classification == "SUSPICIOUS":
            action = "MONITORED"
        elif classification == "HIGH_RISK":
            action = "HEURISTIC_WATCH"
        elif should_contain:
            action = "PROCESS_FORCE_TERMINATED"

        return {
            "risk_score": score,
            "classification": classification,
            "severity": severity,
            "state": state,
            "action_taken": action,
            "should_contain": should_contain,
            "reasons": reasons,
            "indicators": indicators,
            "containment_mode": self.containment_mode,
            "details": "; ".join(reasons) if reasons else "Nominal benign file operation"
        }
