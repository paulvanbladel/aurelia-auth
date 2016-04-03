
import {Container} from 'aurelia-dependency-injection';
import {AuthService} from '../src/auth-service';

let test = {};
describe('AuthService', () => {
  beforeEach(() => {
    test.container = new Container();
    test.$auth = test.container.get(AuthService);
  });

  it('puts the lotion on', () => {
    expect(true).toBe(true);
    console.log(test.$auth);
  });
});
