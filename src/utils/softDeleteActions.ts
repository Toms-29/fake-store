import { DocumentType } from "@typegoose/typegoose"

export const softDeleteById = async <T>(model: any, id: string): Promise<DocumentType<T> | null> => {
    return model.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
    )
}

export const restoreById = async <T>(model: any, id: string): Promise<DocumentType<T> | null> => {
    return model.findByIdAndUpdate(
        id,
        { isDeleted: false, deletedAt: null },
        { new: true }
    )
}