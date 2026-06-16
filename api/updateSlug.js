const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generateSlug(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const products = await prisma.product.findMany({
    where: {
      slug: null
    }
  });

  if (products.length > 0) {
    for (const product of products) {
      const newSlug = generateSlug(product.name);
      await prisma.product.update({
        where: { id: product.id },
        data: { slug: newSlug }
      });
      console.log(`Updated product ${product.id} (${product.name}) with slug: ${newSlug}`);
    }
    console.log(`Successfully updated ${products.length} products.`);
  } else {
    console.log("No products found with null slug.");
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
