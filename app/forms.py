from logging import PlaceHolder
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()],render_kw={"placeholder": "Enter username here..."})
    password = PasswordField('Password', validators=[DataRequired()], render_kw={"placeholder": "Enter password here..."})
    remember_me = BooleanField("Remember me")
    submit = SubmitField('Sign In')

class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()],render_kw={"placeholder": "Enter username here..."})
    password = PasswordField('Password', validators=[DataRequired()], render_kw={"placeholder": "Enter password here..."})
    repeated = PasswordField('Password', validators=[DataRequired()], render_kw={"placeholder": "Repeat password here..."})
    remember_me = BooleanField("Remember me")
    submit = SubmitField('Sign Up')