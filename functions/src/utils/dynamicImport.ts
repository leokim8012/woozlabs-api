export async function importModule(moduleName: string): Promise<any> {
  console.log('importing ', moduleName);
  const importedModule = await import(moduleName);
  console.log('\timported ...');
  return importedModule;
}
