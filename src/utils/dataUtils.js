    import Axios from "axios";

    const POLICY_N_TIMES_USAGE = "N Times Usage";
    const POLICY_DURATION_USAGE = "Duration Usage";
    const POLICY_USAGE_DURING_INTERVAL = "Usage During Interval";

    const POLICY_TYPE_TO_NAME = {
        "ids:NotMoreThanNOffer": POLICY_N_TIMES_USAGE,
        "ids:DurationOffer": POLICY_DURATION_USAGE,
        "ids:IntervalUsageOffer": POLICY_USAGE_DURING_INTERVAL
    };

    const OPERATOR_TYPE_TO_SYMBOL = {
        "idsc:EQ": "=",
        "idsc:LTEQ": "<=",
        "idsc:LT": "<",
    };



    var languages = null;
    var sourcTypes = null;

    export default {
        POLICY_N_TIMES_USAGE,
        POLICY_DURATION_USAGE,
        POLICY_USAGE_DURING_INTERVAL,

        getValue(data, name) {
            let value = "-";
            if (data[name] !== undefined && data[name] != null) {
                if (Array.isArray(data[name])) {
                    value = data[name][0]["@value"];
                } else {
                    value = data[name]["@id"];
                }
            }
            return value;
        },

        convertTypeToPolicyName(type) {
            return POLICY_TYPE_TO_NAME[type];
        },

        convertOperatorTypeToSymbol(type) {
            return OPERATOR_TYPE_TO_SYMBOL[type];
        },

        convertOperatorSymbolToType(symbol) {
            let type = "";
            for (let [key, value] of Object.entries(OPERATOR_TYPE_TO_SYMBOL)) {
                if (value == symbol) {
                    type = key;
                    break;
                }
            }
            return type;
        },

        getLanguages(callback) {
            if (languages == null) {
                Axios.get("http://localhost:80/enum?enumName=Language").then(response => {
                    languages = response.data;
                    callback(languages);
                }).catch(error => {
                    console.log("Error in loadData(): ", error);
                    callback([]);
                });
            } else {
                callback(languages);
            }
        },

        getSourceTypes(callback) {
            if (sourcTypes == null) {
                Axios.get("http://localhost:80/enum?enumName=SourceType").then(response => {
                    sourcTypes = response.data;
                    callback(sourcTypes);
                }).catch(error => {
                    console.log("Error in loadData(): ", error);
                    callback([]);
                });
            } else {
                callback(sourcTypes);
            }
        }
    }