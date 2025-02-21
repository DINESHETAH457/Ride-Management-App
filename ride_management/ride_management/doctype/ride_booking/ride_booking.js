// Copyright (c) 2025, Dccode and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Ride Booking", {
// 	refresh(frm) {

// 	},
// });


frappe.ui.form.on("Ride Booking", {
    estimated_km: function(frm) {
        calculate_total_amount(frm);
    },
    vehicle: function(frm) {
        calculate_total_amount(frm);
    },
    services: function(frm) {
        calculate_total_amount(frm);
    },
    refresh: function(frm) {
        calculate_total_amount(frm);
    }
});

frappe.ui.form.on("Ride Add On", {
    service: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (row.service) {
            frappe.db.get_all("Item", row.service, "standard_selling_rate", (value) => {
                row.amount = value.standard_selling_rate;
                frm.refresh_field("services");
                calculate_total_amount(frm);
            });
        }
    },
    amount: function(frm) {
        calculate_total_amount(frm);
    },
    services_remove: function(frm) {
        calculate_total_amount(frm);
    }
});

function calculate_total_amount(frm) {
    let price_per_km = frm.doc.price_per_km || 0;
    let estimated_km = frm.doc.estimated_km || 0;
    let ride_cost = price_per_km * estimated_km;

    let service_total = 0;
    if (frm.doc.services) {
        frm.doc.services.forEach(service => {
            service_total += service.amount || 0;
        });
    }

    frm.set_value("total_amount", ride_cost + service_total);
}


// frappe.ui.form.on("Ride Add On", {
//     service: function(frm, cdt, cdn) {
//         let row = locals[cdt][cdn];
//         if (row.service) {
//             frappe.call({
//                 method: "get_standard_selling_rate",
//                 args: {
//                     item_code: row.service
//                 },
//                 callback: function(r) {
//                     if (r.message) {
//                         row.amount = r.message;
//                         frm.refresh_field("services");
//                         calculate_total_amount(frm);
//                     }
//                 }
//             });
//         }
//     },
//     amount: function(frm) {
//         calculate_total_amount(frm);
//     },
//     services_remove: function(frm) {
//         calculate_total_amount(frm);
//     }
// });
