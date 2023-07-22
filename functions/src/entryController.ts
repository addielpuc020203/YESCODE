import { db } from "./config/firebaseRd";
import { Request, Response } from "express";

type EntryType = {
  id?: string; // Opcional si Firebase Realtime Database generará automáticamente el ID
  title: string;
  text: string;
};

export const addEntryHandler = async (req: Request<any>, res: Response<any>) => {
  const { title, text } = req.body;
  try {
    const entryRef = db.ref('entries').push();
    const entryId = entryRef.key;
    const entryObject: EntryType = {
      id: entryId ? entryId : undefined,
      title,
      text
    };
    await entryRef.set(entryObject);
    return res.status(200).json({
      status: 'success',
      message: 'entry added successfully',
      data: entryObject
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: '¡Encontramos un error al agregar una entrada!'
    });
  }
}

export const getallEntries = async (req: Request<any>, res: Response<any>) => {
  try {
    const allEntries: EntryType[] = [];
    const querySnapshot = await db.ref('entries').once('value');
    querySnapshot.forEach((snapshot) => {
      const entry = snapshot.val();
      allEntries.push(entry);
    });
    return res.status(200).json(allEntries);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: '¡Error al obtener las entradas!'
    });
  }
}

export const updateEntry = async (req: Request<any>, res: Response<any>) => {
  const { body: { text, title }, params: { entryId } } = req;

  try {
    const entryRef = db.ref('entries').child(entryId);
    const entrySnapshot = await entryRef.once('value');
    const currentData = entrySnapshot.val() || {};

    const entryObject = {
      title: title || currentData.title,
      text: text || currentData.text
    }
    await entryRef.set(entryObject);

    return res.status(200).json({
      status: 'success',
      message: 'entrada actualizada con éxito',
      data: entryObject
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: '¡Encontramos un error al actualizar una entrada!'
    });
  }
}

export const deleteEntry = async (req: Request<any>, res: Response<any>) => {
  const { entryId } = req.params;

  try {
    const entryRef = db.ref('entries').child(entryId);
    await entryRef.remove();

    return res.status(200).json({
      status: 'success',
      message: 'entrada eliminada con éxito'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: '¡Encontramos un error al eliminar una entrada!'
    });
  }
}
