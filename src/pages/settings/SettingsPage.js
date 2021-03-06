import dataUtils from "@/utils/dataUtils";
import errorUtils from "../../utils/errorUtils";
// import errorUtils from "../../utils/errorUtils";
import validationUtils from "../../utils/validationUtils";

export default {
    components: {},
    data() {
        return {
            configId: "",
            proxyAuthenticationNeeded: false,
            proxyUrl: "",
            proxyUsername: "",
            proxyPassword: "",
            proxyNoProxy: "",
            showPassword: false,
            logLevels: [],
            logLevel: "",
            connectorStatus: "",
            connectorDeployModes: [],
            connectorDeployMode: "",
            trustStoreUrl: "",
            trustStorePassword: "",
            keyStoreUrl: "",
            keyStorePassword: "",
            showPasswordTrustStore: false,
            showPasswordKeyStore: false,
            connectorTitle: "",
            connectorDescription: "",
            connectorEndpoint: "",
            connectorVersion: "",
            connectorCurator: "",
            connectorMaintainer: "",
            connectorInboundModelVersion: "",
            connectorOutboundModelVersion: "",
            valid: false,
            urlRule: validationUtils.getUrlNotRequiredRule(),
            urlListRule: validationUtils.getUrlListRule(),
            versionRule: validationUtils.getVersionRule(),
            saveMessage: ""
        };
    },
    mounted: function () {
        this.getSettings();
    },
    methods: {
        async getSettings() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                let response = await dataUtils.getDeployMethods();
                this.$data.deployMethods = response;
                this.$data.logLevels = await dataUtils.getLogLevels();

                response = await dataUtils.getConnectorDeployModes();
                this.$data.connectorDeployModes = response;
            }
            catch (error) {
                errorUtils.showError(error, "Get enum values");
            }

            try {
                let configuration = await dataUtils.getConnectorConfiguration();
                this.$data.configId = configuration.id;
                this.$data.connectorTitle = configuration.title;
                this.$data.connectorDescription = configuration.description;
                this.$data.connectorCurator = configuration.curator;
                this.$data.connectorMaintainer = configuration.maintainer;
                this.$data.connectorEndpoint = configuration.endpoint;
                this.$data.connectorInboundModelVersion = configuration.inboundModelVersion;
                this.$data.connectorOutboundModelVersion = configuration.outboundModelVersion;
                this.$data.connectorVersion = configuration.version;
                this.$data.proxyUrl = configuration.proxyUrl;
                let username = configuration.proxyUsername;
                let password = configuration.proxyPassword;
                let noProxyArray = configuration.noProxyArray;
                this.$data.proxyAuthenticationNeeded = username != "" || password != "";
                this.$data.proxyUsername = username;
                this.$data.proxyPassword = password;
                let noProxy = dataUtils.arrayToCommaSeperatedString(noProxyArray);
                this.$data.proxyNoProxy = noProxy;
                this.$data.logLevel = configuration.logLevel;
                this.$data.connectorStatus = configuration.connectorStatus;
                this.$data.connectorDeployMode = configuration.connectorDeployMode;
                this.$data.trustStoreUrl = configuration.trustStoreUrl;
                this.$data.trustStorePassword = configuration.trustStorePassword;
                this.$data.keyStoreUrl = configuration.keyStoreUrl;
                this.$data.keyStorePassword = configuration.keyStorePassword;
            }
            catch (error) {
                errorUtils.showError(error, "Get connector settings");
            }

            this.$root.$emit('showBusyIndicator', false);
        },
        async saveSettings() {
            let hasError = false;
            this.$data.saveMessage = "";
            this.$root.$emit('showBusyIndicator', true);

            let proxyUsername = null;
            let proxyPassword = null;
            if (this.$data.proxyAuthenticationNeeded) {
                if (this.$data.proxyUsername.trim() != "") {
                    proxyUsername = this.$data.proxyUsername;
                }
                if (this.$data.proxyPassword.trim() != "") {
                    proxyPassword = this.$data.proxyPassword;
                }
            }
            let noProxy = [];
            if (this.$data.proxyNoProxy != null && this.$data.proxyNoProxy.trim() != "") {
                noProxy = this.$data.proxyNoProxy.replace(/ /g, "").split(",");
            }
            try {
                await dataUtils.changeConnectorConfiguration(this.$data.configId, this.$data.connectorTitle,
                    this.$data.connectorDescription, this.$data.connectorCurator, this.$data.connectorMaintainer,
                    this.$data.proxyUrl, noProxy, proxyUsername, proxyPassword, this.$data.logLevel, this.$data.connectorDeployMode,
                    this.$data.trustStoreUrl, this.$data.trustStorePassword, this.$data.keyStoreUrl, this.$data.keyStorePassword);
            }
            catch (error) {
                errorUtils.showError(error, "Get connector settings");
                hasError = true;
            }

            this.getSettings();
            if (!hasError) {
                this.$data.saveMessage = "Successfully saved.";
            }
        }
    }
};
