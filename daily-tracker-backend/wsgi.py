import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    # Standard fallback port is 3001 to align with original Express app config
    port = int(os.environ.get("PORT", 3001))
    app.run(host="0.0.0.0", port=port)
