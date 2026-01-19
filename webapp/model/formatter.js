sap.ui.define([], function () {
    "use strict";
    return {
        priorityState: function (sPriority) {
            switch (sPriority) {
                case "High": return "Error";
                case "Medium": return "Warning";
                case "Low": return "Success";
                default: return "None";
            }
        },
        statusState: function (sStatus) {
            switch (sStatus) {
                case "Open": return "Error";
                case "In Progress": return "Warning";
                case "Closed": return "Success";
                default: return "None";
            }
        },
        severityState: function (sSeverity) {
            switch (sSeverity) {
                case "High": return "Error";
                case "Medium": return "Warning";
                case "Low": return "Success";
                default: return "None";
            }
        }
    };
});
