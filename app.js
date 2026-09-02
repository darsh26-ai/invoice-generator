/* =========================================
   HOURLY SERVICE CALCULATOR
========================================= */

"use strict";


/* =========================================
   APPLICATION STATE
========================================= */

let entries = [];
let editingEntryId = null;


/* =========================================
   DOM ELEMENTS
========================================= */

const personName = document.getElementById("personName");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const invoiceNumber = document.getElementById("invoiceNumber");
const invoiceDate = document.getElementById("invoiceDate");

const addEntryBtn = document.getElementById("addEntryBtn");
const entriesBody = document.getElementById("entriesBody");
const emptyMessage = document.getElementById("emptyMessage");

const totalHours = document.getElementById("totalHours");
const totalLabor = document.getElementById("totalLabor");
const totalTravel = document.getElementById("totalTravel");
const grandTotal = document.getElementById("grandTotal");

const generatePdfBtn =
    document.getElementById("generatePdfBtn");

const printBtn =
    document.getElementById("printBtn");

const clearBtn =
    document.getElementById("clearBtn");


/* =========================================
   MODAL ELEMENTS
========================================= */

const entryModal =
    document.getElementById("entryModal");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelModalBtn =
    document.getElementById("cancelModalBtn");

const saveEntryBtn =
    document.getElementById("saveEntryBtn");

const entryDate =
    document.getElementById("entryDate");

const startTime =
    document.getElementById("startTime");

const endTime =
    document.getElementById("endTime");

const hourlyRate =
    document.getElementById("hourlyRate");

const travelCharge =
    document.getElementById("travelCharge");

const previewHours =
    document.getElementById("previewHours");

const previewLabor =
    document.getElementById("previewLabor");

const previewTotal =
    document.getElementById("previewTotal");

const modalError =
    document.getElementById("modalError");


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /*
       IMPORTANT:
       Keep the Add Work Entry modal hidden
       when the page first loads.
    */

    entryModal.classList.remove("show");

    document.body.classList.remove("modal-open");

    setDefaultDates();

    loadFromStorage();

    renderEntries();

    updateSummary();

});


/* =========================================
   DEFAULT DATES
========================================= */

function setDefaultDates() {

    const today = new Date();

    const dateString =
        today.toISOString().split("T")[0];

    /*
       Only set today's date if there isn't
       already a saved invoice date.
    */

    if (!invoiceDate.value) {
        invoiceDate.value = dateString;
    }

    if (!entryDate.value) {
        entryDate.value = dateString;
    }

}


/* =========================================
   ADD ENTRY BUTTON
========================================= */

addEntryBtn.addEventListener(
    "click",
    () => {

        openEntryModal();

    }
);


/* =========================================
   OPEN ENTRY MODAL
========================================= */

function openEntryModal(entry = null) {

    /*
       Clear previous form values first.
    */

    clearModal();

    editingEntryId = null;


    /*
       EDIT MODE
    */

    if (entry) {

        editingEntryId = entry.id;

        entryDate.value = entry.date;

        startTime.value = entry.start;

        endTime.value = entry.end;

        hourlyRate.value = entry.rate;

        travelCharge.value = entry.travel;

        saveEntryBtn.textContent =
            "Update Entry";

    }


    /*
       ADD MODE
    */

    else {

        saveEntryBtn.textContent =
            "Save Entry";

        /*
           Use invoice date as the default
           work date.
        */

        entryDate.value =
            invoiceDate.value ||
            new Date()
                .toISOString()
                .split("T")[0];

    }


    /*
       Update calculation before showing
       the modal.
    */

    updatePreview();


    /*
       SHOW MODAL
    */

    entryModal.classList.add("show");

    /*
       Prevent the page behind the modal
       from scrolling.
    */

    document.body.classList.add("modal-open");


    /*
       Put focus inside the modal.
    */

    setTimeout(() => {

        if (entry) {

            startTime.focus();

        } else {

            entryDate.focus();

        }

    }, 50);

}


/* =========================================
   CLOSE ENTRY MODAL
========================================= */

function closeEntryModal() {

    entryModal.classList.remove("show");

    document.body.classList.remove(
        "modal-open"
    );

    clearModal();

    editingEntryId = null;

}


/* =========================================
   CLEAR MODAL
========================================= */

function clearModal() {

    entryDate.value =
        invoiceDate.value ||
        new Date()
            .toISOString()
            .split("T")[0];

    startTime.value = "";

    endTime.value = "";

    hourlyRate.value = "";

    travelCharge.value = "0";

    modalError.textContent = "";

    modalError.classList.remove("show");

    previewHours.textContent =
        "0.00";

    previewLabor.textContent =
        "$0.00";

    previewTotal.textContent =
        "$0.00";

}


/* =========================================
   CLOSE BUTTON
========================================= */

closeModalBtn.addEventListener(
    "click",
    closeEntryModal
);


/* =========================================
   CANCEL BUTTON
========================================= */

cancelModalBtn.addEventListener(
    "click",
    closeEntryModal
);


/* =========================================
   CLICK OUTSIDE MODAL
========================================= */

entryModal.addEventListener(
    "click",
    event => {

        /*
           If user clicks the dark area outside
           the actual modal, close it.
        */

        if (event.target === entryModal) {

            closeEntryModal();

        }

    }
);


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            entryModal.classList.contains("show")
        ) {

            closeEntryModal();

        }

    }
);


/* =========================================
   CALCULATE HOURS
========================================= */

function calculateHours(start, end) {

    if (!start || !end) {

        return 0;

    }


    const [startHour, startMinute] =
        start
            .split(":")
            .map(Number);


    const [endHour, endMinute] =
        end
            .split(":")
            .map(Number);


    let startMinutes =
        startHour * 60 +
        startMinute;


    let endMinutes =
        endHour * 60 +
        endMinute;


    /*
       If end time is earlier than start time,
       assume the work continues overnight.

       Example:

       10:00 PM → 2:00 AM

       = 4 hours
    */

    if (endMinutes < startMinutes) {

        endMinutes += 24 * 60;

    }


    const minutes =
        endMinutes - startMinutes;


    return minutes / 60;

}


/* =========================================
   CALCULATE ENTRY
========================================= */

function calculateEntry(
    hours,
    rate,
    travel
) {

    const labor =
        hours * rate;


    const total =
        labor + travel;


    return {
        labor,
        total
    };

}


/* =========================================
   FORMAT MONEY
========================================= */

function formatMoney(value) {

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD"
        }
    ).format(
        Number(value) || 0
    );

}


/* =========================================
   UPDATE PREVIEW
========================================= */

function updatePreview() {

    const hours =
        calculateHours(
            startTime.value,
            endTime.value
        );


    const rate =
        parseFloat(
            hourlyRate.value
        ) || 0;


    const travel =
        parseFloat(
            travelCharge.value
        ) || 0;


    const result =
        calculateEntry(
            hours,
            rate,
            travel
        );


    previewHours.textContent =
        hours.toFixed(2);


    previewLabor.textContent =
        formatMoney(
            result.labor
        );


    previewTotal.textContent =
        formatMoney(
            result.total
        );

}


/* =========================================
   LIVE PREVIEW
========================================= */

[
    entryDate,
    startTime,
    endTime,
    hourlyRate,
    travelCharge
].forEach(element => {

    element.addEventListener(
        "input",
        updatePreview
    );

    element.addEventListener(
        "change",
        updatePreview
    );

});


/* =========================================
   SAVE ENTRY BUTTON
========================================= */

saveEntryBtn.addEventListener(
    "click",
    saveEntry
);


/* =========================================
   SAVE ENTRY
========================================= */

function saveEntry() {

    modalError.classList.remove("show");


    const date =
        entryDate.value;


    const start =
        startTime.value;


    const end =
        endTime.value;


    const rate =
        parseFloat(
            hourlyRate.value
        );


    const travel =
        parseFloat(
            travelCharge.value
        ) || 0;


    /* =====================================
       VALIDATION
    ===================================== */

    if (!date) {

        showModalError(
            "Please select a work date."
        );

        return;

    }


    if (!start || !end) {

        showModalError(
            "Please enter both start and end time."
        );

        return;

    }


    if (
        Number.isNaN(rate) ||
        rate < 0
    ) {

        showModalError(
            "Please enter a valid hourly charge."
        );

        return;

    }


    if (travel < 0) {

        showModalError(
            "Traveling charge cannot be negative."
        );

        return;

    }


    const hours =
        calculateHours(
            start,
            end
        );


    if (hours <= 0) {

        showModalError(
            "The calculated work time must be greater than zero."
        );

        return;

    }


    /* =====================================
       CALCULATE COST
    ===================================== */

    const calculation =
        calculateEntry(
            hours,
            rate,
            travel
        );


    /* =====================================
       CREATE ENTRY
    ===================================== */

    const entry = {

        id:
            editingEntryId ||
            Date.now(),

        date,

        start,

        end,

        hours,

        rate,

        travel,

        labor:
            calculation.labor,

        total:
            calculation.total

    };


    /* =====================================
       UPDATE EXISTING ENTRY
    ===================================== */

    if (editingEntryId) {

        const index =
            entries.findIndex(
                item =>
                    item.id ===
                    editingEntryId
            );


        if (index !== -1) {

            entries[index] =
                entry;

        }

    }


    /* =====================================
       ADD NEW ENTRY
    ===================================== */

    else {

        entries.push(entry);

    }


    /* =====================================
       SORT BY DATE
    ===================================== */

    entries.sort(
        (a, b) =>
            new Date(a.date) -
            new Date(b.date)
    );


    /* =====================================
       SAVE + UPDATE UI
    ===================================== */

    saveToStorage();

    renderEntries();

    updateSummary();

    closeEntryModal();

}


/* =========================================
   SHOW MODAL ERROR
========================================= */

function showModalError(message) {

    modalError.textContent =
        message;

    modalError.classList.add("show");

}


/* =========================================
   RENDER ENTRIES
========================================= */

function renderEntries() {

    entriesBody.innerHTML = "";


    /*
       No entries
    */

    if (entries.length === 0) {

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";


    /*
       Create table row for each entry
    */

    entries.forEach(entry => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${formatDate(entry.date)}
            </td>

            <td>
                ${formatTime(entry.start)}
            </td>

            <td>
                ${formatTime(entry.end)}
            </td>

            <td class="hours-value">
                ${Number(entry.hours).toFixed(2)}
            </td>

            <td class="money">
                ${formatMoney(entry.rate)}
            </td>

            <td class="money">
                ${formatMoney(entry.labor)}
            </td>

            <td class="money">
                ${formatMoney(entry.travel)}
            </td>

            <td class="money total-cell">
                ${formatMoney(entry.total)}
            </td>

            <td>

                <button
                    type="button"
                    class="btn btn-secondary"
                    style="padding:7px 9px;"
                    onclick="editEntry(${entry.id})"
                    title="Edit"
                >
                    ✏️
                </button>

                <button
                    type="button"
                    class="btn btn-danger"
                    style="padding:7px 9px;"
                    onclick="deleteEntry(${entry.id})"
                    title="Delete"
                >
                    🗑️
                </button>

            </td>

        `;


        entriesBody.appendChild(row);

    });

}


/* =========================================
   EDIT ENTRY
========================================= */

window.editEntry = function(id) {

    const entry =
        entries.find(
            item =>
                item.id === id
        );


    if (!entry) {

        return;

    }


    openEntryModal(entry);

};


/* =========================================
   DELETE ENTRY
========================================= */

window.deleteEntry = function(id) {

    const entry =
        entries.find(
            item =>
                item.id === id
        );


    if (!entry) {

        return;

    }


    const confirmed =
        confirm(
            `Delete the work entry for ${formatDate(entry.date)}?`
        );


    if (!confirmed) {

        return;

    }


    entries =
        entries.filter(
            item =>
                item.id !== id
        );


    saveToStorage();

    renderEntries();

    updateSummary();

};


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(timeString) {

    if (!timeString) {

        return "";

    }


    const [hours, minutes] =
        timeString
            .split(":")
            .map(Number);


    const date =
        new Date();


    date.setHours(
        hours,
        minutes,
        0,
        0
    );


    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =========================================
   UPDATE SUMMARY
========================================= */

function updateSummary() {

    let hours = 0;

    let labor = 0;

    let travel = 0;

    let total = 0;


    entries.forEach(entry => {

        hours +=
            Number(entry.hours) || 0;

        labor +=
            Number(entry.labor) || 0;

        travel +=
            Number(entry.travel) || 0;

        total +=
            Number(entry.total) || 0;

    });


    totalHours.textContent =
        hours.toFixed(2);


    totalLabor.textContent =
        formatMoney(labor);


    totalTravel.textContent =
        formatMoney(travel);


    grandTotal.textContent =
        formatMoney(total);

}


/* =========================================
   LOCAL STORAGE
========================================= */

function saveToStorage() {

    const data = {

        person: {

            name:
                personName.value,

            phone:
                phone.value,

            email:
                email.value,

            invoiceNumber:
                invoiceNumber.value,

            invoiceDate:
                invoiceDate.value

        },

        entries

    };


    localStorage.setItem(
        "hourlyServiceCalculator",
        JSON.stringify(data)
    );

}


/* =========================================
   LOAD FROM STORAGE
========================================= */

function loadFromStorage() {

    const saved =
        localStorage.getItem(
            "hourlyServiceCalculator"
        );


    if (!saved) {

        return;

    }


    try {

        const data =
            JSON.parse(saved);


        if (data.person) {

            personName.value =
                data.person.name || "";


            phone.value =
                data.person.phone || "";


            email.value =
                data.person.email || "";


            invoiceNumber.value =
                data.person.invoiceNumber || "";


            invoiceDate.value =
                data.person.invoiceDate ||
                invoiceDate.value;

        }


        if (
            Array.isArray(
                data.entries
            )
        ) {

            entries =
                data.entries;

        }

    } catch (error) {

        console.error(
            "Unable to load saved data:",
            error
        );

    }

}


/* =========================================
   AUTO SAVE PERSON INFORMATION
========================================= */

[
    personName,
    phone,
    email,
    invoiceNumber,
    invoiceDate
].forEach(element => {

    element.addEventListener(
        "input",
        saveToStorage
    );

    element.addEventListener(
        "change",
        saveToStorage
    );

});


/* =========================================
   CLEAR ALL
========================================= */

clearBtn.addEventListener(
    "click",
    clearAll
);


function clearAll() {

    const confirmed =
        confirm(
            "Are you sure you want to clear all information and work entries?"
        );


    if (!confirmed) {

        return;

    }


    entries = [];


    personName.value = "";

    phone.value = "";

    email.value = "";

    invoiceNumber.value = "";


    invoiceDate.value =
        new Date()
            .toISOString()
            .split("T")[0];


    localStorage.removeItem(
        "hourlyServiceCalculator"
    );


    renderEntries();

    updateSummary();

    /*
       Make sure modal is closed too.
    */

    closeEntryModal();

}


/* =========================================
   PRINT
========================================= */

printBtn.addEventListener(
    "click",
    () => {

        if (
            !validateForOutput()
        ) {

            return;

        }


        window.print();

    }
);


/* =========================================
   VALIDATE OUTPUT
========================================= */

function validateForOutput() {

    if (
        !personName.value.trim()
    ) {

        alert(
            "Please enter the person's name."
        );

        personName.focus();

        return false;

    }


    if (
        entries.length === 0
    ) {

        alert(
            "Please add at least one work entry."
        );

        return false;

    }


    return true;

}


/* =========================================
   GENERATE PDF
========================================= */

generatePdfBtn.addEventListener(
    "click",
    generatePDF
);


function generatePDF() {

    if (
        !validateForOutput()
    ) {

        return;

    }


    /*
       Check that jsPDF is available.
    */

    if (
        !window.jspdf ||
        !window.jspdf.jsPDF
    ) {

        alert(
            "PDF library could not be loaded. Please check your internet connection and try again."
        );

        return;

    }


    const {
        jsPDF
    } = window.jspdf;


    const doc =
        new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "letter"
        });


    const pageWidth =
        doc.internal.pageSize.getWidth();


    const pageHeight =
        doc.internal.pageSize.getHeight();


    /* =====================================
       PDF HEADER
    ===================================== */

    doc.setFillColor(
        37,
        99,
        235
    );


    doc.rect(
        0,
        0,
        pageWidth,
        35,
        "F"
    );


    doc.setTextColor(
        255,
        255,
        255
    );


    doc.setFontSize(22);

    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.text(
        "SERVICE COST SUMMARY",
        15,
        15
    );


    doc.setFontSize(10);

    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.text(
        "Hourly Service Calculator",
        15,
        23
    );


    /* =====================================
       PERSON INFORMATION
    ===================================== */

    doc.setTextColor(
        30,
        41,
        59
    );


    doc.setFontSize(10);

    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.text(
        "PERSON INFORMATION",
        15,
        47
    );


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.text(
        `Name: ${personName.value.trim()}`,
        15,
        55
    );


    if (
        phone.value.trim()
    ) {

        doc.text(
            `Phone: ${phone.value.trim()}`,
            15,
            62
        );

    }


    if (
        email.value.trim()
    ) {

        doc.text(
            `Email: ${email.value.trim()}`,
            15,
            69
        );

    }


    const rightX =
        pageWidth - 80;


    if (
        invoiceNumber.value.trim()
    ) {

        doc.text(
            `Reference #: ${invoiceNumber.value.trim()}`,
            rightX,
            55
        );

    }


    if (
        invoiceDate.value
    ) {

        doc.text(
            `Invoice Date: ${formatDate(
                invoiceDate.value
            )}`,
            rightX,
            62
        );

    }


    /* =====================================
       TABLE
    ===================================== */

    const tableRows =
        entries.map(
            entry => [

                formatDate(
                    entry.date
                ),

                formatTime(
                    entry.start
                ),

                formatTime(
                    entry.end
                ),

                Number(
                    entry.hours
                ).toFixed(2),

                formatMoney(
                    entry.rate
                ),

                formatMoney(
                    entry.labor
                ),

                formatMoney(
                    entry.travel
                ),

                formatMoney(
                    entry.total
                )

            ]
        );


    doc.autoTable({

        startY: 78,

        head: [[
            "Date",
            "Start",
            "End",
            "Hours",
            "Hourly Rate",
            "Labor",
            "Travel",
            "Total"
        ]],

        body: tableRows,

        theme: "grid",

        styles: {

            fontSize: 9,

            cellPadding: 4,

            textColor: [
                31,
                41,
                55
            ]

        },

        headStyles: {

            fillColor: [
                37,
                99,
                235
            ],

            textColor: [
                255,
                255,
                255
            ],

            fontStyle: "bold"

        },

        alternateRowStyles: {

            fillColor: [
                248,
                250,
                252
            ]

        },

        columnStyles: {

            0: {
                cellWidth: 32
            },

            1: {
                cellWidth: 25
            },

            2: {
                cellWidth: 25
            },

            3: {
                cellWidth: 25
            },

            4: {
                cellWidth: 32
            },

            5: {
                cellWidth: 32
            },

            6: {
                cellWidth: 32
            },

            7: {
                cellWidth: 32
            }

        }

    });


    /* =====================================
       SUMMARY
    ===================================== */

    const finalY =
        doc.lastAutoTable.finalY + 12;


    let totalHrs = 0;

    let totalLab = 0;

    let totalTrav = 0;

    let totalCost = 0;


    entries.forEach(
        entry => {

            totalHrs +=
                Number(entry.hours) || 0;

            totalLab +=
                Number(entry.labor) || 0;

            totalTrav +=
                Number(entry.travel) || 0;

            totalCost +=
                Number(entry.total) || 0;

        }
    );


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.setFontSize(12);


    doc.text(
        "COST SUMMARY",
        15,
        finalY
    );


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.setFontSize(10);


    doc.text(
        `Total Hours: ${totalHrs.toFixed(2)}`,
        15,
        finalY + 9
    );


    doc.text(
        `Total Labor: ${formatMoney(totalLab)}`,
        15,
        finalY + 17
    );


    doc.text(
        `Total Travel: ${formatMoney(totalTrav)}`,
        15,
        finalY + 25
    );


    /* =====================================
       GRAND TOTAL BOX
    ===================================== */

    const boxWidth = 80;


    const boxX =
        pageWidth -
        boxWidth -
        15;


    const boxY =
        finalY - 5;


    doc.setFillColor(
        238,
        242,
        255
    );


    doc.roundedRect(
        boxX,
        boxY,
        boxWidth,
        34,
        4,
        4,
        "F"
    );


    doc.setTextColor(
        67,
        56,
        202
    );


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.setFontSize(11);


    doc.text(
        "GRAND TOTAL",
        boxX + 8,
        boxY + 11
    );


    doc.setFontSize(18);


    doc.text(
        formatMoney(totalCost),
        boxX + 8,
        boxY + 25
    );


    /* =====================================
       FOOTER
    ===================================== */

    doc.setTextColor(
        100,
        116,
        139
    );


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.setFontSize(8);


    doc.text(
        "Generated using Hourly Service Calculator",
        15,
        pageHeight - 10
    );


    doc.text(
        "Page 1",
        pageWidth - 25,
        pageHeight - 10
    );


    /* =====================================
       FILE NAME
    ===================================== */

    const safeName =
        personName.value
            .trim()
            .replace(
                /[^a-z0-9]/gi,
                "_"
            )
            .replace(
                /_+/g,
                "_"
            );


    const datePart =
        invoiceDate.value ||
        new Date()
            .toISOString()
            .split("T")[0];


    const fileName =
        `Service_Summary_${safeName}_${datePart}.pdf`;


    doc.save(fileName);

}


/* =========================================
   FINAL MODAL SAFETY
========================================= */

window.addEventListener(
    "load",
    () => {

        /*
           Never allow the modal to be visible
           when the application initially loads.
        */

        entryModal.classList.remove(
            "show"
        );

        document.body.classList.remove(
            "modal-open"
        );

    }
);
