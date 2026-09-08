import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { Trash2, Plus, ArrowUp, ArrowDown, MoreVertical } from "lucide-react";

const HomepageManager = () => {
  const { user, isAdmin } = useAuth();
  const [banners, setBanners] = useState([
    { id: 1, imageUrl: '/images/banner1.jpg', altText: 'Banner 1', link: '/products' },
    { id: 2, imageUrl: '/images/banner2.jpg', altText: 'Banner 2', link: '/about' },
  ]);
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [newBannerAltText, setNewBannerAltText] = useState('');
  const [newBannerLink, setNewBannerLink] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  // Redirect if user is not logged in or not an admin
  if (!user) {
    return <Navigate to="/auth?redirect=/homepage-manager" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const handleAddBanner = () => {
    const newId = banners.length > 0 ? Math.max(...banners.map(b => b.id)) + 1 : 1;
    const newBanner = {
      id: newId,
      imageUrl: newBannerUrl,
      altText: newBannerAltText,
      link: newBannerLink,
    };
    setBanners([...banners, newBanner]);
    setNewBannerUrl('');
    setNewBannerAltText('');
    setNewBannerLink('');
    toast({
      title: "Banner added",
      description: "A new banner has been added to the homepage.",
    });
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setNewBannerUrl(banner.imageUrl);
    setNewBannerAltText(banner.altText);
    setNewBannerLink(banner.link);
    setShowDialog(true);
  };

  const handleUpdateBanner = () => {
    if (!editingBanner) return;

    const updatedBanners = banners.map(banner =>
      banner.id === editingBanner.id
        ? { ...banner, imageUrl: newBannerUrl, altText: newBannerAltText, link: newBannerLink }
        : banner
    );
    setBanners(updatedBanners);
    setEditingBanner(null);
    setNewBannerUrl('');
    setNewBannerAltText('');
    setNewBannerLink('');
    setShowDialog(false);
    toast({
      title: "Banner updated",
      description: "The banner has been updated successfully.",
    });
  };

  const handleDeleteBanner = (id) => {
    setBanners(banners.filter(banner => banner.id !== id));
    toast({
      title: "Banner deleted",
      description: "The banner has been removed from the homepage.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-serif mb-6">Homepage Manager</h1>

      <Card>
        <CardHeader>
          <CardTitle>Banners</CardTitle>
          <CardDescription>Manage the banners displayed on the homepage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Alt Text</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>{banner.id}</TableCell>
                    <TableCell>
                      <img src={banner.imageUrl} alt={banner.altText} className="w-20 h-12 object-cover rounded" />
                    </TableCell>
                    <TableCell>{banner.altText}</TableCell>
                    <TableCell>{banner.link}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditBanner(banner)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteBanner(banner.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Add New Banner</CardTitle>
          <CardDescription>Add a new banner to the homepage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="Enter image URL"
                value={newBannerUrl}
                onChange={(e) => setNewBannerUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="altText">Alt Text</Label>
              <Input
                id="altText"
                placeholder="Enter alt text"
                value={newBannerAltText}
                onChange={(e) => setNewBannerAltText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                placeholder="Enter link"
                value={newBannerLink}
                onChange={(e) => setNewBannerLink(e.target.value)}
              />
            </div>
            <Button onClick={handleAddBanner}>Add Banner</Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>
              Make changes to the banner details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="Enter image URL"
                value={newBannerUrl}
                onChange={(e) => setNewBannerUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="altText">Alt Text</Label>
              <Input
                id="altText"
                placeholder="Enter alt text"
                value={newBannerAltText}
                onChange={(e) => setNewBannerAltText(e.target.value)}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                placeholder="Enter link"
                value={newBannerLink}
                onChange={(e) => setNewBannerLink(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateBanner}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomepageManager;
