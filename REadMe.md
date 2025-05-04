# Oshop Project Setup Guide

Built a personal eCommerce website with features like product listing, add/delete products (admin), shopping cart, and checkout process. Implemented a user-friendly UI and dynamic cart management to simulate a real shopping experience.

---

## Prerequisites

Before setting up the project, ensure you have the following installed on your system:

### General Requirements
- **Node.js** (v16 or higher) - [Download Node.js](https://nodejs.org/)
- **Yarn** (v1.22 or higher) - Install via `npm install -g yarn`
- **.NET SDK** (v6.0 or higher) - [Download .NET SDK](https://dotnet.microsoft.com/download)
- **SQL Server** (Express or higher) - [Download SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

### Optional Tools
- **Visual Studio Code** (for frontend development) - [Download VS Code](https://code.visualstudio.com/)
- **Visual Studio 2022** (for backend development) - [Download Visual Studio](https://visualstudio.microsoft.com/)
  - Ensure the **ASP.NET and web development** workload is installed.

---

## Project Structure

The project is organized as follows:

```
Oshop/
├── frontend/       # Angular frontend application
├── WebAPI/         # ASP.NET Core Web API backend
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Oshop
```

---

### 2. Backend Setup (WebAPI)

#### 2.1 Navigate to the Backend Directory

```bash
cd WebAPI
```

#### 2.2 Install Dependencies

Run the following command to restore NuGet packages:

```bash
dotnet restore
```

#### 2.3 Update Configuration Files

Replace the placeholders in the following files:

1. **`appsettings.json`**:
   - Replace `<REPLACE WITH YOUR SQL DB CONNECTION STRING>` with your SQL Server connection string.

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "<YOUR_SQL_CONNECTION_STRING>"
     },
     "AppSettings": {
       "Key": "This is secret key!"
     }
   }
   ```

2. **`appsettings.Development.json`**:
   - Update the `DefaultConnection` string to match your local SQL Server setup.

   Example:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=oshop;Trusted_Connection=true;TrustServerCertificate=True"
     }
   }
   ```

#### 2.4 Apply Migrations and Seed Database

Run the following commands to apply migrations and seed the database:

```bash
dotnet ef database update
```

> **Note**: Ensure the database server is running and accessible.

#### 2.5 Run the Backend Server

Start the WebAPI server:

```bash
dotnet run
```

The API will be available at:
- **HTTPS**: `https://localhost:7063`
- **HTTP**: `http://localhost:5062`

You can access the Swagger UI at `https://localhost:7063/swagger`.

---

### 3. Frontend Setup (Angular)

#### 3.1 Navigate to the Frontend Directory

```bash
cd ../frontend
```

#### 3.2 Install Dependencies

Run the following command to install the required npm packages:

```bash
yarn install
```

#### 3.3 Update Configuration Files

1. **`src/environments/environment.ts`**:
   - Replace the `apiUrl` with the backend API URL (e.g., `https://localhost:7063`).

   Example:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'https://localhost:7063/api'
   };
   ```

2. **`firebase.json`** (if applicable):
   - Update Firebase configuration if Firebase is used for hosting or authentication.

#### 3.4 Run the Frontend Server

Start the Angular development server:

```bash
yarn start
```

The frontend will be available at:
- **http://localhost:4200**

---

## Additional Notes

### Backend Dependencies

The backend uses the following NuGet packages:
- **Entity Framework Core** for database access:
  - `Microsoft.EntityFrameworkCore`
  - `Microsoft.EntityFrameworkCore.SqlServer`
  - `Microsoft.EntityFrameworkCore.Design`
- **Authentication and Authorization**:
  - `Microsoft.AspNetCore.Authentication.JwtBearer`
  - `Microsoft.IdentityModel.Tokens`
- **Swagger** for API documentation:
  - `Swashbuckle.AspNetCore`
- **Newtonsoft.Json** for JSON serialization.

### Frontend Dependencies

The frontend uses the following npm packages:
- **Angular CLI** for development.
- **RxJS** for reactive programming.
- **Bootstrap** for styling (if applicable).

---

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Ensure the SQL Server is running and the connection string is correct in `appsettings.json`.

2. **CORS Issues**:
   - If the frontend cannot access the backend API, ensure CORS is configured in the WebAPI project.

   Example CORS configuration in `Program.cs`:
   ```csharp
   builder.Services.AddCors(options =>
   {
       options.AddPolicy("CorsPolicy", policy =>
       {
           policy.AllowAnyHeader()
                 .AllowAnyMethod()
                 .WithOrigins("http://localhost:4200");
       });
   });

   app.UseCors("CorsPolicy");
   ```

3. **SSL Certificate Issues**:
   - If you encounter SSL certificate errors, trust the development certificate:
     ```bash
     dotnet dev-certs https --trust
     ```

4. **Angular Build Errors**:
   - Ensure the correct Node.js and Angular CLI versions are installed.

---

## Deployment

### Backend Deployment

1. Publish the WebAPI project:
   ```bash
   dotnet publish -c Release -o ./publish
   ```
2. Deploy the published files to a hosting environment (e.g., IIS, Azure, AWS).

### Frontend Deployment

1. Build the Angular project:
   ```bash
   yarn build --prod
   ```
2. Deploy the contents of the `dist/` folder to a web server (e.g., Firebase Hosting, AWS S3, or Azure Static Web Apps).

---

## Conclusion

You have successfully set up the **Oshop** project. If you encounter any issues, refer to the troubleshooting section or consult the project documentation. Happy coding! 🎉