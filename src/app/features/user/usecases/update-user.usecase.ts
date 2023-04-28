import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.usecase.contract";
import { UserRepository } from "../repository/user.repository";

interface UpdateUserParams {
  userId: string;
  username?: string;
  password?: string;
}

export class UpdateUserUsecase {
  public async execute(
    data: UpdateUserParams
  ): Promise<Return> {
    const repository = new UserRepository();

    // validator?
    // if (!userId) {
    //     return RequestError.notProvided(
    //       res,
    //       "User"
    //     );
    //   }

    const result = await repository.update(
      data.userId,
      {
        username: data.username,
        password: data.password,
      }
    );

    if (result === 0) {
      return {
        ok: false,
        code: 404,
        message: "Usuario nao encontrado",
      };
    }

    const cacheRepository = new CacheRepository();
    await cacheRepository.delete(
      "listaDeUsuarios"
    );

    return {
      ok: true,
      data: data.userId,
      message: "Usuario editado com sucesso",
      code: 200,
    };
  }
}
