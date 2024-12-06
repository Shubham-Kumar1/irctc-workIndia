# IRCTC Railway Management System

This project is a simplified version of a railway management system like IRCTC. It allows users to search for trains between two stations, check seat availability, and book seats. Admins can add or update train details. The system is designed to handle simultaneous booking requests while preventing race conditions.

---

## **Features**

1. **User Management**:
   - Register a user (Admin/User role).
   - Login to get an authentication token.

2. **Admin Operations** (Protected by API Key):
   - Add a new train.
   - Update train details (optional for future development).

3. **User Operations**:
   - Check train and seat availability between two stations.
   - Book a seat on a train.
   - Get booking details for logged-in users.

4. **Race Condition Handling**:
   - Ensures only one user can book the same seat in a train at the same time.

---

## **Tech Stack**

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Environment Management**: dotenv

---

## **Setup Instructions**

### **1. Prerequisites**

Ensure you have the following installed:
- Node.js v14+ and npm
- PostgreSQL database
- Prisma CLI (`npm install -g prisma`)

### **2. Clone the Repository**

```bash
git clone https://github.com/Shubham-Kumar1/irctc-workIndia.git
cd irctc-railway-management

Sure! Below is the content for a `.txt` file that includes setup instructions and steps to test the API endpoints.

---

Clone the GitHub repository:

```bash
git clone https://github.com/Shubham-Kumar1/irctc-workIndia.git
cd irctc-railway-management
```

---

## **1. Install Dependencies**

Install the required dependencies:

```bash
npm install
```

---

## **2. Configure Environment Variables**

Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
JWT_SECRET=your_jwt_secret_key
ADMIN_API_KEY=your_admin_api_key
PORT=3000
```

- Replace `<username>`, `<password>`, `<host>`, `<port>`, and `<database>` with your PostgreSQL credentials.
- Set a `JWT_SECRET` for token generation and `ADMIN_API_KEY` to secure the admin routes.

---

## **3. Set Up the Database**

Run Prisma commands to initialize and set up the database:

1. Initialize Prisma:
   ```bash
   npx prisma init
   ```

2. Run migrations to create the database schema:
   ```bash
   npx prisma migrate dev --name init
   ```

3. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

---

## **4. Start the Server**

Start the application server:

```bash
npm run dev
```

The server will run on `http://localhost:3000`.

---

## **5. Testing API Endpoints**

### **5.1. Register User**

**POST** `http://localhost:3000/auth/register`

**Body**:
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "securepassword",
  "role": "user"
}
```

### **5.2. Login User**

**POST** `http://localhost:3000/auth/login`

**Body**:
```json
{
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "token": "your_jwt_token"
}
```

### **5.3. Admin - Add Train**

**POST** `http://localhost:3000/admin/train`

**Headers**:
```json
{
  "api-key": "your_admin_api_key"
}
```

**Body**:
```json
{
  "name": "Rajdhani Express",
  "source": "Delhi",
  "destination": "Mumbai",
  "seats": 100
}
```

### **5.4. Check Train Availability**

**GET** `http://localhost:3000/booking/availability`

**Query Parameters**:
- `source`: `Delhi`
- `destination`: `Mumbai`

**Example**:
`/booking/availability?source=Delhi&destination=Mumbai`

**Response**:
```json
[
  {
    "id": 1,
    "name": "Rajdhani Express",
    "source": "Delhi",
    "destination": "Mumbai",
    "seats": 100
  }
]
```

### **5.5. Book a Seat**

**POST** `http://localhost:3000/booking/book`

**Headers**:
```json
{
  "token": "your_jwt_token"
}
```

**Body**:
```json
{
  "trainId": 1,
  "seats": 2
}
```

**Response**:
```json
{
  "message": "Booking successful"
}
```

### **5.6. Get Booking Details**

**GET** `http://localhost:3000/booking/booking`

**Headers**:
```json
{
  "token": "your_jwt_token"
}
```

**Response**:
```json
[
  {
    "id": 1,
    "train": {
      "id": 1,
      "name": "Rajdhani Express",
      "source": "Delhi",
      "destination": "Mumbai"
    },
    "seats": 2,
    "createdAt": "2024-12-07T12:00:00Z"
  }
]
```

---

## **6. Example Dummy Data to Test**

1. **Register a new user** (with role as `user`).
2. **Login** with the registered email and password to receive the JWT token.
3. **Login as Admin**: You can create an admin user by setting the role as `admin` during registration. Use this user to access admin routes.

---

## **9. Notes**

- Ensure to replace placeholder values like `your_admin_api_key` and `your_jwt_secret_key` with actual values.
- Use **Postman** to test the API endpoints effectively.
- The JWT token is required for any user or booking-related operations. Store it securely.