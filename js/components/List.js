Vue.component('List', {
    data: function () {
        return {
            key: 'todo',
            items: [],
            titleNew: '',
            itemEdit: {
                title: ''
            },
            titleOld: '',
            actionCurrent: '',
            filterCurrent: ''
        };
    },

    computed: {
        filterClass: function () {
            switch (this.filterCurrent) {
                case 'active':
                    return 'todo-list-filter-active';
                case 'complete':
                    return 'todo-list-filter-complete';
                default:
                    return '';
            }
        }
    },

    methods: {
        addItem: function () {
            this.items.push({title: this.titleNew, active: true, checked: false});
            this.titleNew = '';

            this.saveData();
        },

        removeItem: function (index) {
            this.items.splice(index, 1);

            this.saveData();
        },

        toggleItem: function (item) {
            item.active = !item.active;

            this.saveData();
        },

        editStart: function (item) {
            this.titleOld = item.title;
            this.itemEdit = item;
        },

        editFinish: function () {
            this.itemEdit = {
                title: ''
            };

            this.saveData();
        },

        editCancel: function (item) {
            item.title = this.titleOld;
            this.titleOld = '';

            this.itemEdit = {
                title: ''
            };
        },

        doAction: function () {
            var i, item, itemsLeft = [];

            switch (this.actionCurrent) {
                case 'delete':
                    for (i in this.items) {
                        item = this.items[i];
                        if (!item.checked) {
                            itemsLeft.push(item);
                        }
                    }
                    this.items = itemsLeft;
                    break;
                case 'complete':
                    for (i in this.items) {
                        item = this.items[i];
                        if (item.checked) {
                            item.active = false;
                            item.checked = false;
                        }
                    }
                    break;
                case 'active':
                    for (i in this.items) {
                        item = this.items[i];
                        if (item.checked) {
                            item.active = true;
                            item.checked = false;
                        }
                    }
                    break;
            }

            this.actionCurrent = '';

            this.saveData();
        },

        applyFilter: function () {
            if (this.filterCurrent) {
                window.location.hash = '#' + this.filterCurrent;
            } else {
                history.replaceState({}, document.title, ".");
            }
        },

        saveData: function () {
            localStorage.setItem(this.key, JSON.stringify(this.items));
        },

        loadData: function () {
            this.items = JSON.parse(localStorage.getItem(this.key)) || [];
        }
    },

    created: function () {
        this.filterCurrent = window.location.hash.replace('#', '');
        this.loadData();
    },

    directives: {
        'list-focus': function (el, value) {
            if (value) {
                el.focus()
            }
        }
    },

    template: `
        <ul :class="filterClass" class="todo-list list-group">
            <li class="todo-list-header list-group-item active">
                <form @submit.prevent="addItem">
                    <input v-model.lazy="titleNew" type="text" class="form-control input-sm" placeholder="What needs to be done?" autofocus>
                </form>
            </li>
            <li v-for="(item, index) in items" class="todo-list-item list-group-item" :class="{'list-group-item-warning': item.active, 'list-group-item-success': !item.active}">
                <div @dblclick="editStart(item)" v-show="item != itemEdit">
                    <span class="todo-list-title"><input v-model="item.checked" type="checkbox">{{ item.title }}</span>
                    <span @click.prevent="removeItem(index)" class="glyphicon glyphicon-remove"></span>
                    <span @click.prevent="toggleItem(item)" :class="{'glyphicon-ok': item.active, 'glyphicon-repeat': !item.active}" class="glyphicon"></span>
                </div>
                <input v-show="item == itemEdit" v-list-focus="item == itemEdit" v-model="itemEdit.title" @keyup.enter="editFinish" @keyup.esc="editCancel(item)" type="text" class="form-control input-sm">
            </li>
            <li v-show="items.length" class="todo-list-footer list-group-item active form-inline">
                With selected:
                <select v-model="actionCurrent" @change="doAction" class="todo-list-batch-update form-control input-sm">
                    <option value="">Choose action</option>
                    <option value="delete">Delete</option>
                    <option value="complete">Mark as complete</option>
                    <option value="active">Mark as active</option>
                </select>
                <select v-model="filterCurrent" @change="applyFilter" class="todo-list-filter form-control input-sm">
                    <option value="">Show all</option>
                    <option value="active">Show active</option>
                    <option value="complete">Show complete</option>
                </select>
            </li>
        </ul>
    `
});