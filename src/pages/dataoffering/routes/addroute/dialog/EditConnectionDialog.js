import dataUtils from "@/utils/dataUtils";
import validationUtils from "../../../../../utils/validationUtils";

export default {
    components: {

    },
    data() {
        return {
            dialog: false,
            title: "",
            connection: null,
            isNewConnection: true,
            outputId: null,
            outputs: [],
            inputId: null,
            inputs: [],
            valid: false,
            defaultRule: validationUtils.getRequiredRule(),
            sourceNode: null,
            destinationNode: null
        };
    },
    mounted: function () { },
    methods: {
        async show(connection, nodes, isNewConnection) {
            let autoSetInput = false;
            let autoSetOutput = false;
            this.$data.isNewConnection = isNewConnection;
            this.$data.connection = connection;
            this.$data.sourceNode = dataUtils.getNode(connection.source.id, nodes);
            this.$data.destinationNode = dataUtils.getNode(connection.destination.id, nodes);
            let sourceEndpoints = await dataUtils.getEndpointList(this.$data.sourceNode);
            this.$data.outputs = [];
            for (let endpoint of sourceEndpoints) {
                this.$data.outputs.push(this.getItem(endpoint));
            }
            let destEndpoints = await dataUtils.getEndpointList(this.$data.destinationNode);
            this.$data.inputs = [];
            for (let endpoint of destEndpoints) {
                this.$data.inputs.push(this.getItem(endpoint));
            }

            if (connection.sourceEndpointId === undefined) {
                if (sourceEndpoints.length == 1) {
                    this.$data.outputId = this.getItem(sourceEndpoints[0]).id;
                    autoSetOutput = true;
                } else {
                    this.$data.outputId = null;
                }
            } else {
                this.$data.outputId = connection.sourceEndpointId;
            }
            if (connection.destinationEndpointId === undefined) {
                if (destEndpoints.length == 1) {
                    this.$data.inputId = this.getItem(destEndpoints[0]).id;
                    autoSetInput = true;
                } else {
                    this.$data.inputId = null;
                }
            } else {
                this.$data.inputId = connection.destinationEndpointId;
            }
            this.dialog = true;
            this.$refs.form.resetValidation();
            // If there are no alternative inputs/outputs for the user to select, then automatically save connection settings.
            if (((autoSetInput || this.$data.destinationNode.type == "idsendpointnode") && (autoSetOutput || this.$data.sourceNode.type == "idsendpointnode"))) {
                this.save();
            }
        },
        save() {
            this.$data.connection.sourceEndpointId = this.$data.outputId;
            this.$data.connection.destinationEndpointId = this.$data.inputId;

            if (this.$data.isNewConnection) {
                this.$emit('newConnectionSaved', this.$data.connection);
            }
            this.dialog = false;
        },
        getItem(endpoint) {
            let item = null;
            if (endpoint.type == "GENERIC") {
                item = {
                    id: endpoint.id,
                    text: endpoint.accessUrl
                };
            } else if (endpoint.type == "APP") {
                item = {
                    id: endpoint.id,
                    text: endpoint.title
                };
            }
            return item;
        }
    }
};
