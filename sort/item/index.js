// components/coolui-scroller-nav/item/index.js
Component({
  relations: {
    "../index/index": {
      type: "parent",
      linked: function (target) {
        // console.log(target);
      },
    },
  },
  properties: {
    title: {
      type: String,
    },
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    value: {
      type: String,
    },
    options: {
      type: Array,
    },
    color: {
      type: String,
    },
    activeColor: {
      type: String,
    },
    multiple: {
      type: Boolean,
      value: false,
    },
    actionBar: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    isDropdownShow: false,
    overlayDuration: 0,
    dropAnimation: {},
    select: null,
    selectArray: [],
  },
  methods: {
    toggle() {
      var nodes = this.getRelationNodes("../index/index");
      this.setData({
        overlayDuration: nodes[0].data.overlayDuration,
      });
      // console.log(this.data.name);
      nodes[0].toggle(this.data.name);
    },
    toggleDropdown(active) {
      if (active === this.data.name) {
        if (this.data.isDropdownShow === false) {
          if (this.data.multiple) {
            this.setData({
              selectArray: this.data.value ? this.data.value.split(",") : [],
              isDropdownShow: true,
            });
          } else {
            this.setData({
              select: parseInt(this.data.value),
              isDropdownShow: true,
            });
          }
        } else {
          this.setData({
            isDropdownShow: false,
          });
        }
      } else {
        this.setData({
          isDropdownShow: false,
        });
      }
    },
    select(e) {
      var nodes = this.getRelationNodes("../index/index");
      if (this.data.multiple) {
        const selectArray = this.data.selectArray;
        const id = e.target.dataset.id;
        const isIn = this.inArray(id, selectArray);
        if (isIn === false) {
          selectArray.push(e.target.dataset.id);
        } else {
          selectArray.splice(isIn, 1);
        }
        this.setData({
          selectArray: selectArray.sort(),
        });
      } else {
        if (!this.data.actionBar) {
          this.setData(
            {
              select:
                e.target.dataset.id != this.data.select
                  ? e.target.dataset.id
                  : null,
              value:  e.target.dataset.id != this.data.select
              ? e.target.dataset.id
              : null,
            },
            () => {
              setTimeout(() => {
                nodes[0].toggle(null);
              }, 600);
            }
          );
        } else {
          this.setData({
            select:  e.target.dataset.id != this.data.select
            ? e.target.dataset.id
            : null,
          });
        }
      }
    },
    inArray(search, array) {
      for (var i in array) {
        if (array[i] == search) {
          return i;
        }
      }
      return false;
    },
    clear() {
      this.setData({
        value: "",
        selectArray: [],
      });
    },
    confirm() {
      var nodes = this.getRelationNodes("../index/index");
      if (this.data.multiple) {
        this.setData(
          {
            value: this.data.selectArray.join(","),
          },
          () => {
            setTimeout(() => {
              nodes[0].toggle(null);
            }, 500);
          }
        );
      } else {
        this.setData(
          {
            value: this.data.select,
          },
          () => {
            setTimeout(() => {
              nodes[0].toggle(null);
            }, 500);
          }
        );
      }
    },
  },
  ready() {},
});
