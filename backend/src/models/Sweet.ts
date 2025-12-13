export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const sweets: Sweet[] = [];

export default {
  findAll: async () => sweets,
  create: async (sweet: Sweet) => {
    sweets.push(sweet);
    return sweet;
  },
  clear: async () => {
    sweets.length = 0;
  }
};
