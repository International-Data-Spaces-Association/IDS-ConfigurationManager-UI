import dataUtils from "@/utils/dataUtils";
import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";


export default {
    components: {
        ConfirmationDialog
    },
    data() {
        return {
            search: '',
            headers: [{
                text: 'Title',
                value: 'title'
            },
            {
                text: 'Description',
                value: 'description'
            },
            {
                text: 'Type',
                value: 'sourceType'
            }, {
                text: 'Policy',
                value: 'policyName'
            },
            {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right'
            }
            ],
            resources: [],
            filteredResources: [],
            filterResourceType: null
        };
    },
    mounted: function () {
        this.getResources();
    },
    methods: {
        getResources() {
            // this.$root.$emit('showBusyIndicator', true);
            // TODO Get resources 
        },
        filterChanged() {
            if (this.$data.filterResourceType == null | this.$data.filterResourceType == "All") {
                this.$data.filteredResources = this.$data.resources;
            } else {
                this.$data.filteredResources = [];
                for (var resource of this.$data.resources) {
                    if (resource.type == this.$data.filterResourceType) {
                        this.$data.filteredResources.push(resource);
                    }
                }
            }
        },
        deleteItem(item) {
            this.$refs.confirmationDialog.title = "Delete Resource";
            this.$refs.confirmationDialog.text = "Are you sure you want to delete the resource '" + item.title + "'?";
            this.$refs.confirmationDialog.callbackData = {
                item: item
            };
            this.$refs.confirmationDialog.callback = this.deleteCallback;
            this.$refs.confirmationDialog.dialog = true;
        },
        deleteCallback(choice, callbackData) {
            if (choice == "yes") {
                this.$root.$emit('showBusyIndicator', true);
                dataUtils.deleteResource(callbackData.item.id, () => {
                    this.getResources();
                    this.$root.$emit('showBusyIndicator', false);
                });
            }
        },
        editItem(item) {
            this.$router.push('editresource?id=' + item.id);
        },
        showItem(item) {
            this.$refs.resourceDetailsDialog.show(item);
        }
    },
};
