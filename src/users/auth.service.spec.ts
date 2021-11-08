import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    // Create a fake copy of the users service
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);

        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Date.now(), email, password } as User;
        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          // If somebody asks for the UsersService
          provide: UsersService,
          // Then serve them the fakeUsersService
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect.assertions(1);
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    expect.assertions(3);
    const user = await service.signup('test@test.com', 'test');

    expect(user.password).not.toEqual('test');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with an email that is in use', (done) => {
    expect.assertions(1);

    service.signup('test@test.com', 'test').then(() => {
      service.signup('test@test.com', 'test').catch((e) => {
        expect(e).toBeInstanceOf(BadRequestException);
        done();
      });
    });
  });

  it('throws a NotFoundException when the user is not found', (done) => {
    expect.assertions(1);

    service.signin('test@test.com', 'test').catch((e) => {
      expect(e).toBeInstanceOf(NotFoundException);
      done();
    });
  });

  it('throws a BadRequestException when the password is incorrect', (done) => {
    expect.assertions(1);

    service.signup('test@test.com', 'test').then(() => {
      service.signin('test@test.com', 'wrongPassword').catch((e) => {
        expect(e).toBeInstanceOf(BadRequestException);
        done();
      });
    });
  });

  it('succesfully logs in a user', async () => {
    await service.signup('test@test.com', 'test');

    const user = await service.signin('test@test.com', 'test');
    expect(user).toBeDefined();
  });
});
