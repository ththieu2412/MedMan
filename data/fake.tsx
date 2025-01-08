const faker = require('faker'); // Cài đặt thư viện faker
const fs = require('fs'); // Để ghi dữ liệu vào file

const generateRandomDoctors = (num) => {
  const doctors = [];
  for (let i = 0; i < num; i++) {
    const id = i + 1;
    const gender = faker.helpers.randomize(['Nam', 'Nữ']);
    const role = faker.helpers.randomize(['Doctor', 'Pharmacist', 'Staff']);
    const isActive = faker.helpers.randomize([true, false]);

    doctors.push({
      id,
      full_name: faker.name.findName(),
      date_of_birth: faker.date.past(30, new Date()).toISOString().split('T')[0], // Sinh nhật ngẫu nhiên trong 30 năm qua
      gender,
      id_card: faker.random.number({ min: 100000000000, max: 999999999999 }).toString(),
      phone_number: faker.phone.phoneNumber(),
      address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.country()}`,
      email: faker.internet.email(),
      image: faker.helpers.randomize([null, faker.image.avatar()]),
      role,
      password: faker.internet.password(),
      isActive,
    });
  }
  return doctors;
};

// Tạo thêm 100 mẫu dữ liệu giả
const additionalDoctors = generateRandomDoctors(100);

// Chuyển đổi mảng dữ liệu thành JSON và lưu vào file
fs.writeFileSync('employees.json', JSON.stringify(additionalDoctors, null, 2), 'utf-8');

console.log('Dữ liệu đã được ghi vào file doctors.json');
