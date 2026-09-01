# 💼 Hourly Service Calculator

A simple, modern browser-based application for calculating hourly service costs and generating professional PDF summaries.

The application is completely client-side and does not require a backend or database.

---

## ✨ Features

### 👤 Person Information

Enter:

- Person name
- Phone number
- Email
- Invoice/reference number
- Invoice date

---

### 🕐 Multiple Work Entries

Add as many work entries as needed.

Each entry supports:

- Work date
- Start time
- End time
- Hourly charge
- Traveling charge

The application automatically calculates:

- Total hours
- Labor cost
- Entry total

---

### 🌙 Overnight Work

Overnight work is supported automatically.

For example:


Start: 10:00 PM
End:   2:00 AM

Total: 4.00 hours


You do not need to manually calculate the overnight duration.

---

### 💰 Automatic Summary

The application calculates:


Total Hours
Total Labor
Total Travel
Grand Total


Example:


Total Hours:       15.00
Total Labor:      $600.00
Total Travel:      $70.00
---------------------------
Grand Total:      $670.00


---

### ✏️ Edit Entries

Existing entries can be edited at any time.

Click the:

```text
✏️
```

button next to the entry.

---

### 🗑️ Delete Entries

Click:


🗑️


to remove an individual work entry.

---

### 📄 PDF Generation

The application generates a professional PDF containing:

* Person information
* Invoice/reference number
* Invoice date
* Work entries
* Work dates
* Start/end times
* Total hours
* Hourly rate
* Labor cost
* Traveling charge
* Entry totals
* Total hours
* Total labor
* Total travel
* Grand total

The PDF is automatically named using the person's name and invoice date.

Example:


Service_Summary_John_Smith_2026-09-01.pdf


---

### 🖨️ Printing

The application also includes a print option.

Click:


🖨️ Print


The browser's print dialog will open.

---

### 💾 Automatic Saving

The application uses browser `localStorage`.

This means your information is automatically saved in the browser while you work.

If you close the browser and return to the page later, your information can be restored.

---

## 📁 Project Structure

```text
hourly-service-calculator/
│
├── index.html
├── style.css
├── app.js
└── README.md
```

---

## 🚀 How to Run

No server is required.

Simply download or clone the project.

Open:


index.html


in Chrome, Edge, Firefox, or another modern browser.

---

## 🐙 GitHub Setup

Create a new GitHub repository.

For example:


hourly-service-calculator


Upload:


index.html
style.css
app.js
README.md


Then open:


index.html


locally to test the application.

---

## 🌐 GitHub Pages

The application can also be hosted using GitHub Pages.

After uploading the project:

1. Open the GitHub repository.
2. Go to **Settings**.
3. Select **Pages**.
4. Under **Build and deployment**, select:

   * Source: Deploy from a branch
   * Branch: `main`
5. Save.

GitHub will provide a public website address.

---

## 📦 PDF Libraries

PDF generation uses:

* jsPDF
* jsPDF AutoTable

These libraries are loaded from CDN in `index.html`.

Internet access is required when the page first loads these libraries.

---

## 🔒 Privacy

All entered information is processed in the browser.

The project does not send customer information to a server.

Data is stored locally using browser `localStorage`.

Do not use browser local storage as a replacement for a secure business database if you later expand this application to handle sensitive customer information.

---

## 🧮 Calculation Formula

For normal work:


Hours = End Time - Start Time


Labor:


Labor Cost = Hours × Hourly Rate


Entry total:


Entry Total = Labor Cost + Traveling Charge


Overall total:


Grand Total =
    Total Labor
    + Total Traveling Charges


---

## 🌙 Overnight Calculation

If the end time is earlier than the start time, the application assumes the work continued into the following day.

Example:


Start: 11:00 PM
End:    3:00 AM


The application calculates:


4.00 hours


---

## 🛠️ Future Improvements

Possible future additions include:

* Company name and logo
* Company address
* Customer address
* Mileage calculation
* Traveling rate per mile
* Separate tax
* Discounts
* Deposit/payment tracking
* Paid / unpaid status
* Multiple customers
* Customer history
* Monthly reports
* Export to Excel
* Email PDF
* Invoice numbering
* Custom PDF templates
* Dark mode
* Password protection
* Cloud database
* User accounts
* Automatic backups

---

## 📄 License

This project can be modified and used for personal or business purposes.

---

## ❤️ Built For

Simple and convenient tracking of hourly work, travel charges, and service costs.
