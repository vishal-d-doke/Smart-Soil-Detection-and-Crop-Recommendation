import os
import sys
import shutil

# Ensure backend directory is in sys.path
backend_dir = os.path.join(os.path.dirname(__file__), "..", "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# On serverless platforms (Vercel / AWS Lambda), the deployment filesystem is read-only.
# We use /tmp for writable SQLite and seed it with the packaged database if available.
if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    tmp_db = "/tmp/app.db"
    if not os.path.exists(tmp_db):
        source_db = os.path.join(backend_dir, "app.db")
        if os.path.exists(source_db):
            try:
                shutil.copy2(source_db, tmp_db)
            except Exception:
                pass
    if "DATABASE_URL" not in os.environ:
        os.environ["DATABASE_URL"] = f"sqlite:///{tmp_db}"

from app.main import app
