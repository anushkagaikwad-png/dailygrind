from flask import Blueprint, request, jsonify, current_app
from app.models import db, DailyLog

api = Blueprint("api", __name__)

@api.before_request
def authorize_admin():
    # Allow GET and OPTIONS requests without authentication
    if request.method in ("GET", "OPTIONS"):
        return None
        
    admin_key = current_app.config.get("ADMIN_KEY")
    client_key = request.headers.get("x-admin-key")
    
    if not client_key or client_key.strip() != admin_key:
        return jsonify({"error": "Unauthorized: Invalid or missing admin passcode."}), 401

@api.route("/logs", methods=["GET"])
def get_logs():
    try:
        logs = DailyLog.query.order_by(DailyLog.date.desc()).all()
        return jsonify([log.to_dict() for log in logs])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route("/logs", methods=["POST"])
def post_log():
    try:
        data = request.json or {}
        date = data.get("date")
        if not date:
            return jsonify({"error": "Date is required"}), 400
            
        dsa_questions = data.get("dsa_questions")
        core_subject = data.get("core_subject")
        core_hours = data.get("core_hours")
        development_hours = data.get("development_hours")
        sleep_hours = data.get("sleep_hours")
        notes = data.get("notes")
        
        # Check if log already exists for date
        log = DailyLog.query.filter_by(date=date).first()
        if log:
            log.dsa_questions = int(dsa_questions) if dsa_questions is not None and dsa_questions != "" else 0
            log.core_subject = core_subject
            log.core_hours = float(core_hours) if core_hours is not None and core_hours != "" else 0.0
            log.development_hours = float(development_hours) if development_hours is not None and development_hours != "" else 0.0
            log.sleep_hours = float(sleep_hours) if sleep_hours is not None and sleep_hours != "" else 0.0
            log.notes = notes or ""
        else:
            log = DailyLog(
                date=date,
                dsa_questions=int(dsa_questions) if dsa_questions is not None and dsa_questions != "" else 0,
                core_subject=core_subject,
                core_hours=float(core_hours) if core_hours is not None and core_hours != "" else 0.0,
                development_hours=float(development_hours) if development_hours is not None and development_hours != "" else 0.0,
                sleep_hours=float(sleep_hours) if sleep_hours is not None and sleep_hours != "" else 0.0,
                notes=notes or ""
            )
            db.session.add(log)
            
        db.session.commit()
        return jsonify(log.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api.route("/logs/<int:log_id>", methods=["PUT"])
def put_log(log_id):
    try:
        data = request.json or {}
        log = DailyLog.query.get(log_id)
        if not log:
            return jsonify({"error": "Log not found"}), 404
            
        # Update fields if provided in request
        if "date" in data:
            log.date = data["date"]
        if "dsa_questions" in data:
            dsa_val = data["dsa_questions"]
            log.dsa_questions = int(dsa_val) if dsa_val is not None and dsa_val != "" else 0
        if "core_subject" in data:
            log.core_subject = data["core_subject"]
        if "core_hours" in data:
            ch_val = data["core_hours"]
            log.core_hours = float(ch_val) if ch_val is not None and ch_val != "" else 0.0
        if "development_hours" in data:
            dh_val = data["development_hours"]
            log.development_hours = float(dh_val) if dh_val is not None and dh_val != "" else 0.0
        if "sleep_hours" in data:
            sh_val = data["sleep_hours"]
            log.sleep_hours = float(sh_val) if sh_val is not None and sh_val != "" else 0.0
        if "notes" in data:
            log.notes = data["notes"] or ""
            
        db.session.commit()
        return jsonify({"message": "updated"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api.route("/logs/<int:log_id>", methods=["DELETE"])
def delete_log(log_id):
    try:
        log = DailyLog.query.get(log_id)
        if log:
            db.session.delete(log)
            db.session.commit()
        return jsonify({"message": "deleted"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
