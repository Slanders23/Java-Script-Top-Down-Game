from flask import Flask, render_template , session, redirect, url_for, g, request
from database import get_db, close_db
from forms import LoginForm, RegistrationForm
from werkzeug.security import generate_password_hash, check_password_hash
app = Flask(__name__)
app.config["SECRET_KEY"] = "thisISMySecrettKey"
app.teardown_appcontext(close_db)
app.config["UPLOAD_FOLDER"] = "static/images"
@app.before_request
def load_logged_in_user():
    g.user = session.get("user_name")
   
@app.route("/", methods=["GET","POST"])
def index():
    return render_template("index.html")
@app.route("/help", methods=["GET","POST"])
def help():
    return render_template("help.html")
@app.route("/play", methods=["GET","POST"])
def play():
    return render_template("game.html")
@app.route("/leaderboard", methods=["GET","POST"])
def leaderBoard():
    db = get_db()
    leaderBoard = db.execute("""SELECT * FROM LeaderBoard Order By score DESC""").fetchall()
    return render_template("Leaderboard.html" , leaderBoard=leaderBoard)

@app.route("/register", methods=["GET","POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user_name = form.user_name.data
        password = form.password.data
        db = get_db()
        clash = db.execute("""SELECT * 
                           FROM users 
                           WHERE user_name = ?;""",(user_name,)).fetchone()

        if clash is not None:
            form.user_name.errors.append("User id already taken")
        else:
            db.execute("""INSERT INTO users (user_name, password) VALUES (?,?);""", (user_name, generate_password_hash(password)))
            db.commit()
            return redirect(url_for("login"))
    return render_template("registration.html", form = form)

@app.route("/logout")
def logout():
    session.clear()
    session.modified = True
    return redirect(url_for('index'))



@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user_name = form.user_name.data
        password = form.password.data
        db = get_db()
        user_in_db = db.execute("""SELECT * 
                                FROM users 
                                WHERE user_name = ?;""", (user_name,)).fetchone()
        if user_in_db is None:
            form.user_name.errors.append("NO such user name!")
        elif not check_password_hash(
            user_in_db["password"], password):
            form.password.errors.append("Incorrect password!")
        else:
            session.clear()
            session["user_name"] = user_name
            session.modified = True
            next_page= request.args.get("next")
            if not next_page:
                next_page = url_for("index")
            return redirect(next_page)
    return render_template("login.html", form=form)        

@app.route("/store_score", methods=["POST"])
def store_score():
    if not g.user:
        return "not_logged_in"  
    db = get_db()
    score = int(request.form["score"])
    db.execute("""INSERT INTO LeaderBoard (user_name,Score ) VALUES (?,?);""", ( g.user,score))
    db.commit()
    print(score)
    return "success"