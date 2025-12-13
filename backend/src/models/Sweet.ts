export interface SweetType {
  _id: number;        // internal
  id: string;         // public (tests expect this)
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

class Sweet {
  private static sweets: SweetType[] = [];
  private static nextId = 1;

  static async clear(): Promise<void> {
    Sweet.sweets = [];
    Sweet.nextId = 1;
  }

  static async findAll(): Promise<SweetType[]> {
    return Sweet.sweets;
  }

  static async findById(id: string): Promise<SweetType | undefined> {
    return Sweet.sweets.find(s => s.id === id);
  }

  static async create(
    data: Omit<SweetType, "_id" | "id">
  ): Promise<SweetType> {
    const _id = Sweet.nextId++;

    const sweet: SweetType = {
      _id,
      id: _id.toString(),   // 🔑 key fix
      ...data,
    };

    Sweet.sweets.push(sweet);
    return sweet;
  }

  static async updateById(
    id: string,
    data: Partial<Omit<SweetType, "_id" | "id">>
  ): Promise<SweetType | undefined> {
    const sweet = Sweet.sweets.find(s => s.id === id);
    if (!sweet) return undefined;

    Object.assign(sweet, data);
    return sweet;
  }

  static async deleteById(id: string): Promise<boolean> {
    const index = Sweet.sweets.findIndex(s => s.id === id);
    if (index === -1) return false;

    Sweet.sweets.splice(index, 1);
    return true;
  }
}

export default Sweet;
