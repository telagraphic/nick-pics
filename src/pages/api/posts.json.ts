import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const GET: APIRoute = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

  const postsDirectory = path.join(process.cwd(), 'src/pages/posts');
  const filenames = fs.readdirSync(postsDirectory);
  const totalPosts = filenames.length;

  const posts = filenames
    .slice((page - 1) * pageSize, page * pageSize)
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      return {
        slug: filename.replace(/\.md$/, ''),
        ...data,
      };
    });

  return new Response(JSON.stringify({ posts, totalPosts }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
