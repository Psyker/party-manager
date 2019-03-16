import axios from "axios";
import * as M from "materialize-css";
import Vue from "vue";
import * as winston from "winston";

declare interface Guest {
    id?: number
    name: string;
    type: string;
    age: number;
    major: boolean;
}

// tslint:disable-next-line no-unused-expression
new Vue({
    computed: {
        hasGuests(): boolean {
            return this.isLoading === false && this.guests.length > 0;
        },
        noGuests(): boolean {
            return this.isLoading === false && this.guests.lenght === 0;
        }
    },
    data() {
        return {
            name: "",
            type: "",
            age: 0,
            major: false,
            isLoading: true,
            selectedGuest: "",
            selectedGuestId: 0,
            guests: []
        };
    },
    el: "#app",
    methods: {
        addGuest() {
            const guest: Guest = {
                name: this.name,
                type: this.type,
                age: this.age,
                major: this.major
            };
            axios
                .post("/api/guests/add", guest)
                .then(() => {
                    this.name = "";
                    this.type = "";
                    this.age = 0;
                    this.major = false;
                    this.loadGuests();
                }).catch((err: any) => {
                    winston.log("error", err.message);
                });
        },
        confirmDeleteGuest(id: number) {
            const guest = this.guests.find((g: Guest) => g.id === id);
            this.selectedGuest = `${guest.name} ${guest.type} ${guest.age}`;
            this.selectedGuestId = guest.id;
            const dc = this.$refs.deleteConfirm;
            const modal = M.Modal.init(dc);
            modal.open();
        },
        deleteGuest(id: number) {
            axios
                .delete(`/api/guests/remove/${id}`)
                .then(this.loadGuests)
                .catch((err: any) => {
                    winston.log('error', err.message)
                })
        },
        loadGuests() {
            axios
                .get("/api/guests/all")
                .then((res: any) => {
                    this.isLoading = false;
                    this.guests = res.data
                }).catch((err: any) => {
                    winston.log('error', err.message)
            })
        }
    },
    mounted() {
        return this.loadGuests()
    }
});
