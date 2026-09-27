from flask_wtf import FlaskForm
from wtforms import StringField,PasswordField, SubmitField, FloatField, IntegerField, FileField, SelectField,BooleanField,RadioField
from wtforms.validators import InputRequired, EqualTo, DataRequired, Optional, NumberRange

class RegistrationForm(FlaskForm):
    user_name = StringField("User ID", validators=[InputRequired()])
    password = PasswordField("Password", validators=[InputRequired()])
    password2 = PasswordField("Confirm Password", validators=[InputRequired(),EqualTo("password")])
    submit = SubmitField("Register")

class LoginForm(FlaskForm):
    user_name = StringField("User ID", validators=[InputRequired()])
    password = PasswordField("Password", validators=[InputRequired()])
    submit = SubmitField("Sign In")
