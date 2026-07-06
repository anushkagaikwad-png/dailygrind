from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class DailyLog(db.Model):
    __tablename__ = 'daily_logs'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.String(255), unique=True, nullable=True)
    dsa_questions = db.Column(db.Integer, default=0)
    core_subject = db.Column(db.String(255), nullable=True)
    core_hours = db.Column(db.Numeric(5, 2), default=0.00)
    development_hours = db.Column(db.Numeric(5, 2), default=0.00)
    sleep_hours = db.Column(db.Numeric(5, 2), default=0.00)
    notes = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date,
            "dsa_questions": self.dsa_questions,
            "core_subject": self.core_subject,
            "core_hours": float(self.core_hours) if self.core_hours is not None else 0.0,
            "development_hours": float(self.development_hours) if self.development_hours is not None else 0.0,
            "sleep_hours": float(self.sleep_hours) if self.sleep_hours is not None else 0.0,
            "notes": self.notes
        }
