import { Request, Response } from "express";
import { ServerError } from "../../../shared/errors/generic.error";
import { RequestError } from "../../../shared/errors/request.error";
import { Note } from "../../../models/note.model";
// import { User } from "../models/user.model";
import { SuccessResponse } from "../../../shared/util/success.response";
import { NoteRepository } from "../repository/note.repository";
import { UserRepository } from "../../user/repository/user.repository";
import { CreateNoteUsecase } from "../usecases/create-note.usecase";
import { ListNoteUsecase } from "../usecases/list-note.usecase";

export class NoteController {
  public async listAll(
    req: Request,
    res: Response
  ) {
    try {
      const { userId } = req.params;
      const { title, filed } = req.query;

      const result =
        await new ListNoteUsecase().execute({
          userId,
          title,
          filed,
        });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async listOne(
    req: Request,
    res: Response
  ) {
    try {
      const { userId, noteId } = req.params;

      const userDatabase = new UserRepository();
      const user =
        userDatabase.getUserById(userId);

      const noteDatabase = new NoteRepository();
      const note = await noteDatabase.getNoteById(
        noteId
      );

      return SuccessResponse.ok(
        res,
        "Note successfully listed",
        note
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async create(
    req: Request,
    res: Response
  ) {
    try {
      const { userId } = req.params;
      const { title, description } = req.body;

      const result =
        await new CreateNoteUsecase().execute({
          userId,
          title,
          description,
        });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async delete(
    req: Request,
    res: Response
  ) {
    try {
      const { userId, noteId } = req.params;

      const database = new NoteRepository();
      const result = await database.delete(
        noteId
      );

      if (result === 0) {
        return RequestError.notFound(res, "Note");
      }

      return SuccessResponse.ok(
        res,
        "Note successfully deleted",
        noteId
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async update(
    req: Request,
    res: Response
  ) {
    try {
      const { userId, noteId } = req.params;
      const { title, description, filed } =
        req.body;

      const userDatabase = new UserRepository();
      const user =
        userDatabase.getUserById(userId);

      const data = {
        title,
        description,
        filed,
      };
      const noteDatabase = new NoteRepository();
      const result = await noteDatabase.update(
        noteId,
        data
      );

      return SuccessResponse.ok(
        res,
        "Note successfully updated",
        {
          result,
        }
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
