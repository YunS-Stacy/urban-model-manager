import { createContext } from 'react';

const FoldersContext = createContext(null as null | IFolder[]);

export const {
  Provider: FoldersProvider,
  Consumer: FoldersConsumer,
} = FoldersContext;

export default FoldersContext;
