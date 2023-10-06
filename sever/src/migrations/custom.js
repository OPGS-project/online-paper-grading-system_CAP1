module.exports = {
  up: function (queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn("", "filename", Sequelize.STRING); // thêm trường  // Table, Tên trg, Loại dữ liệu
  },

  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn("", ""); // xóa trường xong bảng
  },
};

// chạy câu lệnh để add or delete
