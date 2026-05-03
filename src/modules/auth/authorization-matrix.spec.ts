import { ROLES_KEY } from './decorators/roles.decorator';
import { Role } from './domain/role.enum';
import { ClassificationSocietiesController } from '../classification-societies/api/classification-societies.controller';
import { ManufacturersController } from '../manufacturers/api/manufacturers.controller';
import { ShipbuildersController } from '../shipbuilders/api/shipbuilders.controller';
import { VesselTypesController } from '../vessel-types/api/vessel-types.controller';
import { VesselsController } from '../vessels/api/vessels.controller';

function getRoles(target: object, methodName: string): Role[] | undefined {
  const method = (target as Record<string, unknown>)[methodName];
  return Reflect.getMetadata(ROLES_KEY, method) as Role[] | undefined;
}

describe('Authorization role matrix', () => {
  it('allows manager to create and update vessels', () => {
    expect(getRoles(VesselsController.prototype, 'create')).toEqual([
      Role.ADMIN,
      Role.MANAGER,
    ]);

    expect(getRoles(VesselsController.prototype, 'update')).toEqual([
      Role.ADMIN,
      Role.MANAGER,
    ]);
  });

  it('allows only admin to delete vessels', () => {
    expect(getRoles(VesselsController.prototype, 'remove')).toEqual([
      Role.ADMIN,
    ]);
  });

  it('allows only admin to modify manufacturers', () => {
    expect(getRoles(ManufacturersController.prototype, 'create')).toEqual([
      Role.ADMIN,
    ]);
    expect(getRoles(ManufacturersController.prototype, 'update')).toEqual([
      Role.ADMIN,
    ]);
    expect(getRoles(ManufacturersController.prototype, 'remove')).toEqual([
      Role.ADMIN,
    ]);
  });

  it('allows only admin to modify shipbuilders', () => {
    expect(getRoles(ShipbuildersController.prototype, 'create')).toEqual([
      Role.ADMIN,
    ]);
    expect(getRoles(ShipbuildersController.prototype, 'update')).toEqual([
      Role.ADMIN,
    ]);
    expect(getRoles(ShipbuildersController.prototype, 'remove')).toEqual([
      Role.ADMIN,
    ]);
  });

  it('allows only admin to modify vessel types', () => {
    expect(getRoles(VesselTypesController.prototype, 'create')).toEqual([
      Role.ADMIN,
    ]);
    expect(getRoles(VesselTypesController.prototype, 'update')).toEqual([
      Role.ADMIN,
    ]);
    expect(getRoles(VesselTypesController.prototype, 'remove')).toEqual([
      Role.ADMIN,
    ]);
  });

  it('allows only admin to modify classification societies', () => {
    expect(
      getRoles(ClassificationSocietiesController.prototype, 'create'),
    ).toEqual([Role.ADMIN]);
    expect(
      getRoles(ClassificationSocietiesController.prototype, 'update'),
    ).toEqual([Role.ADMIN]);
    expect(
      getRoles(ClassificationSocietiesController.prototype, 'remove'),
    ).toEqual([Role.ADMIN]);
  });
});
