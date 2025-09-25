#!/usr/bin/env python3
"""
Specialized error handling test runner for CI/CD pipeline.

This script specifically runs error-related tests to validate the error handling
and integration components of the PluginMind backend.
"""

import subprocess
import sys
import os
from pathlib import Path


def main():
    """Run error-related tests with proper configuration."""

    # Ensure we're in the correct directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)

    print("🚨 Running Error Handling Tests...")
    print("=" * 50)

    # Define error test files
    error_test_files = [
        "tests/test_error_handling.py",
        "tests/test_error_integration.py"
    ]

    # Verify test files exist
    missing_files = []
    for test_file in error_test_files:
        if not Path(test_file).exists():
            missing_files.append(test_file)

    if missing_files:
        print(f"❌ Missing test files: {', '.join(missing_files)}")
        sys.exit(1)

    # Run each error test file with verbose output
    failed_tests = []

    for test_file in error_test_files:
        print(f"\n🔍 Running {test_file}...")
        print("-" * 40)

        try:
            # Run pytest with specific test file
            result = subprocess.run([
                sys.executable, "-m", "pytest",
                test_file,
                "-v",  # verbose
                "--tb=short",  # short traceback format
                "--no-header",  # cleaner output
                "--disable-warnings"  # reduce noise
            ], check=False, capture_output=False)

            if result.returncode != 0:
                failed_tests.append(test_file)
                print(f"❌ {test_file} failed with exit code {result.returncode}")
            else:
                print(f"✅ {test_file} passed")

        except Exception as e:
            print(f"❌ Error running {test_file}: {e}")
            failed_tests.append(test_file)

    # Summary
    print("\n" + "=" * 50)
    print("🚨 Error Test Summary")
    print("=" * 50)

    if failed_tests:
        print(f"❌ Failed tests: {len(failed_tests)}")
        for test in failed_tests:
            print(f"   - {test}")
        print(f"✅ Passed tests: {len(error_test_files) - len(failed_tests)}")
        sys.exit(1)
    else:
        print(f"✅ All error tests passed! ({len(error_test_files)} test files)")
        print("🎉 Error handling system is robust and working correctly")


if __name__ == "__main__":
    main()