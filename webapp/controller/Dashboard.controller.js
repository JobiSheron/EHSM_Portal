sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "ehsm/model/formatter",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/m/ObjectIdentifier",
    "sap/m/ObjectStatus",
    "sap/ui/model/type/Date"
], function (Controller, JSONModel, Filter, FilterOperator, formatter, MessageToast, ColumnListItem, Text, ObjectIdentifier, ObjectStatus, DateType) {
    "use strict";

    return Controller.extend("ehsm.controller.Dashboard", {
        formatter: formatter,

        onInit: function () {
            var oViewModel = new JSONModel({
                openIncidentsCount: 0,
                highRisksCount: 0
            });
            this.getView().setModel(oViewModel, "dashboardView");
            this.getOwnerComponent().getRouter().getRoute("Dashboard").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var sEmployeeId = oEvent.getParameter("arguments").employeeId;
            if (sEmployeeId) {
                // Pad EmployeeId to 8 characters if needed (e.g. "1" -> "00000001")
                this.sEmployeeId = ("00000000" + sEmployeeId).slice(-8);
                this._loadData(this.sEmployeeId);
            }
        },

        _loadData: function (sEmployeeId) {
            var oModel = this.getOwnerComponent().getModel();
            var oViewModel = this.getView().getModel("dashboardView");
            var aFilters = [new Filter("EmployeeId", FilterOperator.EQ, sEmployeeId)];

            // Load Incidents
            oModel.read("/zehsm_incidentSet", {
                filters: aFilters,
                success: function (oData) {
                    oViewModel.setProperty("/incidents", oData.results);
                    oViewModel.setProperty("/openIncidentsCount", oData.results.filter(i => i.IncidentStatus === "Open").length);
                    // Keep a copy for local filtering
                    this._allIncidents = oData.results;
                }.bind(this),
                error: function (oError) {
                    MessageToast.show("Failed to load incidents");
                }
            });

            // Load Risks
            oModel.read("/zehsm_riskSet", {
                filters: aFilters,
                success: function (oData) {
                    oViewModel.setProperty("/risks", oData.results);
                    oViewModel.setProperty("/highRisksCount", oData.results.filter(r => r.RiskSeverity === "High").length);
                    // Keep a copy for local filtering
                    this._allRisks = oData.results;
                }.bind(this),
                error: function (oError) {
                    MessageToast.show("Failed to load risks");
                }
            });
        },

        onSearchIncidents: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oViewModel = this.getView().getModel("dashboardView");
            var aData = this._allIncidents || [];

            if (sQuery) {
                aData = aData.filter(function (item) {
                    return (item.IncidentDescription && item.IncidentDescription.toLowerCase().indexOf(sQuery.toLowerCase()) !== -1) ||
                        (item.IncidentId && item.IncidentId.toLowerCase().indexOf(sQuery.toLowerCase()) !== -1);
                });
            }
            oViewModel.setProperty("/incidents", aData);
        },

        onSearchRisks: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oViewModel = this.getView().getModel("dashboardView");
            var aData = this._allRisks || [];

            if (sQuery) {
                aData = aData.filter(function (item) {
                    return (item.RiskDescription && item.RiskDescription.toLowerCase().indexOf(sQuery.toLowerCase()) !== -1) ||
                        (item.RiskId && item.RiskId.toLowerCase().indexOf(sQuery.toLowerCase()) !== -1);
                });
            }
            oViewModel.setProperty("/risks", aData);
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("Login", {}, true);
        },

        onLogout: function () {
            this.onNavBack();
            MessageToast.show("Logged out successfully");
        }
    });
});
