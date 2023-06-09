import { TypeormConnection } from "../../../../main/database/typeorm.connection";
import { NoteEntity } from "../../../shared/database/entities/note.entity";
import { Note } from "../../../models/note.model";

export class NoteRepository {
  private repository =
    TypeormConnection.connection.getRepository(
      NoteEntity
    );

  public async list(
    userId: string,
    title?: string,
    filed?: boolean
  ) {
    const result = await this.repository.find({
      where: {
        idUser: userId,
        title,
        filed,
      },
      relations: ["user"],
    });

    return result.map((note) =>
      NoteRepository.mapEntityToModel(note)
    );
  }

  public static mapEntityToModel(
    entity: NoteEntity
  ): Note {
    return Note.create(
      entity.id,
      entity.title,
      entity.description,
      entity.filed
    );
  }

  public async getNoteById(id: string) {
    const result =
      await this.repository.findOneBy({ id });

    if (!result) {
      return 0;
    }

    return NoteRepository.mapEntityToModel(
      result
    );
  }

  public async create(
    userId: string,
    note: Note
  ) {
    const noteEntity = this.repository.create({
      id: note.id,
      title: note.title,
      description: note.description,
      filed: note.filed,
      idUser: userId,
    });

    const result = await this.repository.save(
      noteEntity
    );
    return NoteRepository.mapEntityToModel(
      result
    );
  }

  public async update(
    id: string,
    title?: string,
    description?: string,
    filed?: boolean
  ) {
    const result = await this.repository.update(
      {
        id,
      },
      {
        title: title,
        description: description,
        filed: filed,
      }
    );

    if (result.affected === 1) {
      return {
        id,
        title,
        description,
        filed,
      };
    }

    return null;
  }

  public async delete(id: string) {
    const result = await this.repository.delete({
      id,
    });
    return result.affected ?? 0;
  }
}
