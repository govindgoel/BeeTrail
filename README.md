```markdown
# 🐝 Bee-Pollination Beckn API Wrapper

A FastAPI-based backend service that implements the [Beckn Protocol](https://becknprotocol.io) for a farmer-beekeeper matchmaking system. This wrapper provides endpoints for managing farmers, beekeepers, orders, ratings, OTP-based login, and more.

---

## 🚀 Features

- ⚙️ Built with FastAPI
- 📄 Implements Beckn Protocol (Core v0.9.4)
- 🧑‍🌾 Farmer and Beekeeper management
- ⭐ Ratings and feedback
- 📦 Order lifecycle (search, select, init, confirm, status)
- 🔐 OTP-based authentication
- 🌐 CORS enabled
- 📄 Serve contract PDFs statically
- 📱 Mobile app for users
- LLAMA(3) Support

---

## 📁 Project Structure

├── main.py                      # FastAPI app entry point
├── contracts/                  # Folder for PDF contract files
├── routes/
│   ├── beekeeper\_routes.py
│   ├── farmer\_routes.py
│   ├── rating\_routes.py
│   ├── order\_routes.py
│   ├── matchmaking\_routes.py
│   └── otp\_routes.py
├── frontend/
│   └── app-release.apk         # Android APK for mobile application


---

## 🛠️ Installation & Run (Backend)

### 1. Clone the repository

```bash
git clone https://github.com/govindgoel/BEETRAIL.git
cd BEETRAIL
````

### 2. Create and activate a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the server

```bash
uvicorn main:app --host 0.0.0.0 --port 8008
```

---

## 🧪 API Docs

FastAPI provides interactive documentation:

* Swagger UI: [http://localhost:8008/api/docs](http://localhost:8008/api/docs)
* ReDoc: [http://localhost:8008/api/redoc](http://localhost:8008/api/redoc)

---

## 📱 Mobile App

A companion **mobile application** is available for farmers, beekeepers, and other stakeholders to interact with the system.

### 🔹 APK File

The APK file is located at:

```
frontend/app-release.apk
```

You can install it on an Android device by enabling “Install from Unknown Sources” and then opening the file.

### 🔹 Features

* OTP-based login
* View and manage orders
* Matchmaking interface
* View contracts
* Feedback and ratings

---

## 🌐 Endpoints Overview

| Method | Path                    | Description                     |
| ------ | ----------------------- | ------------------------------- |
| GET    | `/`                     | Root welcome message            |
| GET    | `/protocol/discover`    | Discover Beckn protocol support |
| GET    | `/contracts/{filename}` | Serve contract PDFs             |
|        | `/beekeeper/...`        | Beekeeper routes                |
|        | `/farmer/...`           | Farmer routes                   |
|        | `/rating/...`           | Rating routes                   |
|        | `/order/...`            | Order management routes         |
|        | `/matchmaking/...`      | Matchmaking logic               |
|        | `/otp/...`              | OTP authentication routes       |

---