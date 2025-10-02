import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { debounce } from 'lodash';
import { SearchIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/posts',
    },
];

interface LinksType {
    url: string | null;
    label: string;
    active: boolean;
}

interface PostType {
    id: number;
    title: string;
    content: string;
    category: string;
    status: string;
    image: string;
}

interface PostsType {
    data: PostType[];
    links: LinksType[];
    from: number;
    to: number;
    total: number;
}

export default function Dashboard({ posts }: { posts: PostsType[] }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;

    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message);
        }
    }, [flash.message]);

    const handleSearch = useRef(
        debounce((query: string) => {
            router.get(
                '/posts',
                { search: query },
                { preserveState: true, replace: true },
            );
        }, 500),
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="relative w-full sm:w-1/3">
                            <Input
                                id={'search'}
                                className="peer ps-9"
                                placeholder="Search..."
                                type="search"
                                onChange={onSearchChange}
                            />
                            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                                <SearchIcon size={16} aria-hidden="true" />
                            </div>
                        </div>
                        <Button className="mt-4">
                            <Link href={'/posts/create'} prefetch>
                                Create Post
                            </Link>
                        </Button>
                    </div>

                    <Card className="mt-4">
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Content</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {posts.data?.map((post, index) => (
                                        <TableRow key={post.id || index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <img
                                                    src={`/storage/${post.image}`}
                                                    alt={post.title}
                                                    className="h-10 w-10 rounded"
                                                />
                                            </TableCell>
                                            <TableCell>{post.title}</TableCell>
                                            <TableCell>
                                                {post.content}
                                            </TableCell>
                                            <TableCell>
                                                {post.category}
                                            </TableCell>
                                            <TableCell>
                                                {post.status == '0' ? (
                                                    <Badge className="bg-red-500">
                                                        Inactive
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-green-500">
                                                        Active
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="space-x-1">
                                                <Button asChild size={'sm'}>
                                                    <Link
                                                        href={`/posts/${post.id}/edit`}
                                                        prefetch
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>

                                                <Button
                                                    size={'sm'}
                                                    variant={'destructive'}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
