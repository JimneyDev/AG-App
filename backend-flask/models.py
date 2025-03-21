from database import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    display_name = db.Column(db.String(120), nullable=True)
    dark_mode = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<User {self.username}>"
