from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/add_attendee', methods=['GET', 'POST'])
def add_attendee():
    if request.method == 'POST':
        # Handle form submission and save data as needed
        return redirect(url_for('add_attendee'))
    return render_template('add_attendee.html')

@app.route('/checkout', methods=['GET', 'POST'])
def checkout():
    if request.method == 'POST':
        # Handle checkout form submission (e.g., process payment)
        return redirect(url_for('checkout'))
    return render_template('checkout.html')

if __name__ == '__main__':
    app.run(debug=True)
