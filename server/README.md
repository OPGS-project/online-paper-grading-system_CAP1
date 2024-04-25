## package

@babel/core
@babel/node
@babel/preset-env
sequelize-cli
bcrypt
cors
dotenv
sequelize
mysql2
jsonwebtoken
http-errors joi
passport-google-oauth20

### câu lệnh đẩy bảng lên db

npx sequelize db:migrate

## lỗi

500 : lỗi đường dẫn
400 : trang không tồn tại
200 :

# set-u

---

cd client
npm install

---

cd server
npm install @babel/preset-env --save-dev
npm install --save mysql2
npm install --save sequelize
cd src
npx sequelize db:migrate
cd ..
edit env and config
npm start
