import { User } from '../../user/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.userName = faker.internet.userName();
  user.email = faker.internet.email();
  user.avatarUrl = faker.image.avatar();
  user.fullName = faker.person.fullName();
  user.password = 'Test@123';
  return user;
});
