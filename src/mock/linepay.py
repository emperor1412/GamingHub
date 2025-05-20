from flask import Flask, jsonify, request
import time

app = Flask(__name__)

# Mock payment status
payment_status = {}

@app.route('/v3/payments/request', methods=['POST'])
def request_payment():
    data = request.json
    payment_id = f"mock_payment_{int(time.time())}"
    
    # Store payment info
    payment_status[payment_id] = {
        "status": "PENDING",
        "amount": data.get("amount", 0),
        "currency": data.get("currency", "TWD"),
        "productName": data.get("productName", "Mock Product")
    }
    
    return jsonify({
        "returnCode": "0000",
        "returnMessage": "Success",
        "info": {
            "paymentUrl": {
                "web": f"https://mock-line-pay.com/pay/{payment_id}",
                "app": f"line://mock-pay/{payment_id}"
            },
            "paymentAccessToken": f"mock_token_{payment_id}",
            "transactionId": payment_id
        }
    })

@app.route('/v3/payments/<payment_id>/confirm', methods=['POST'])
def confirm_payment(payment_id):
    if payment_id not in payment_status:
        return jsonify({
            "returnCode": "1105",
            "returnMessage": "Payment not found"
        }), 404
    
    # Update payment status
    payment_status[payment_id]["status"] = "COMPLETED"
    
    return jsonify({
        "returnCode": "0000",
        "returnMessage": "Success",
        "info": {
            "transactionId": payment_id,
            "orderId": f"mock_order_{payment_id}",
            "status": "COMPLETED"
        }
    })

@app.route('/v3/payments/<payment_id>/status', methods=['GET'])
def check_payment_status(payment_id):
    if payment_id not in payment_status:
        return jsonify({
            "returnCode": "1105",
            "returnMessage": "Payment not found"
        }), 404
    
    return jsonify({
        "returnCode": "0000",
        "returnMessage": "Success",
        "info": {
            "transactionId": payment_id,
            "status": payment_status[payment_id]["status"]
        }
    })

if __name__ == '__main__':
    app.run(port=5000)
