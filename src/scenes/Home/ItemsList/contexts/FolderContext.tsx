import { createContext } from 'react';
import { IFolder } from '..';

type TFolderContext = {
  folders: null | IFolder[];
  folderId: null | IFolder['id'];
}

const FolderContext = createContext({
  folders: null,
  folderId: null,
} as TFolderContext);

export const {
  Provider: FolderProvider,
  Consumer: FolderConsumer,
} = FolderContext;

export default FolderContext;
