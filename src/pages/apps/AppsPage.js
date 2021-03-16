
export default {
    components: {
    },
    data() {
        return {
            search: '',
            headers: [{
                text: 'Title',
                value: 'title',
                width: 250
            }, {
                text: 'Description',
                value: 'descriptionShort'
            },
            {
                text: 'Maintainer',
                value: 'maintainer',
                width: 150
            }
            ],
            apps: [],
            selected: [],
            showFreeNowApp: false
        };
    },
    mounted: function () {
        if (process.env.VUE_APP_SHOW_FREENOW_APP !== undefined && process.env.VUE_APP_SHOW_FREENOW_APP != "#SHOW_FREENOW_APP#") {
            this.$data.showFreeNowApp = process.env.VUE_APP_SHOW_FREENOW_APP;
        }
        this.getApps();
    },
    methods: {
        getApps() {
            this.$data.apps = [];
            if (this.$data.showFreeNowApp) {
                this.$data.apps.push({
                    title: "Einfache Wetterwarnungen auf Gemeindeebene",
                    description: "Diese DataApp stellt vereinfachte \"Wetterwarnungen auf Gemeindeebene\" des DWD bereit. Die \"Wetterwarnungen und Vorabinformationen auf Gemeindeebene\" des DWD werden nach Warnungen gefiltert und komplexe Polygonbeschreibungen der Gemeindegrenzen werden zu einer einfachen Mittelpunkt-Koordinate reduziert.",
                    descriptionShort: "Diese DataApp stellt vereinfachte \"Wetterwarnungen auf Gemeindeebene\" des DWD bereit. Die \"Wetterwarnungen und [...]",
                    maintainer: "Fraunhofer IVI"
                });
            }
        }
    }
};
