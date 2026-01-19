sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function (Controller, MessageToast, UIComponent) {
    "use strict";

    return Controller.extend("ehsm.controller.Login", {
        onInit: function () {
        },

        onLoginPress: function () {
            var sEmployeeId = this.byId("userIdInput").getValue();
            var sPassword = this.byId("passwordInput").getValue();

            if (!sEmployeeId || !sPassword) {
                MessageToast.show("Please enter both Employee ID and Password.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/zehsm_loginSet(EmployeeId='" + sEmployeeId + "',Password='" + sPassword + "')";

            // Show busy indicator (simulation)
            sap.ui.core.BusyIndicator.show(0);

            oModel.read(sPath, {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    if (oData.Status === "Success") {
                        MessageToast.show("Login Successful");
                        var oRouter = UIComponent.getRouterFor(this);
                        oRouter.navTo("Dashboard", {
                            employeeId: sEmployeeId
                        }); 
                    } else {
                        MessageToast.show("Login Failed: " + (oData.Message || "Invalid Credentials"));
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Login Error. Please check network or credentials.");
                    console.error(oError);
                    // For demo purposes if offline or CORS fails, we might want to allow bypass if user requests it, but code should be correct.
                }
            });
        }
    });
});
