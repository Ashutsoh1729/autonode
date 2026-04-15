"use client";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { formatDistanceToNow } from "date-fns";
import { useSuspenceWorkflows } from "@/features/workflows/hooks/use-workflows";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { credentials } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useWorkflowsParams } from "@/features/workflows/hooks/use-workflows-params";
import { CredentialsSheet } from "./credentials-sheet";
import {
  useRemoveCredential,
  useSuspenceCredential,
  useSuspenceCredentials,
} from "../hooks/credentials.hooks";
import { useAtom } from "jotai";
import { credentialDialog } from "../store/credentials.atom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { ProviderLogo } from "@/lib/logo";

export const CredentialsLoading = () => {
  return <LoadingView message="Workflow is loading..." />;
};

export const CredentialsError = () => {
  return <ErrorView message="Workflow is loading..." />;
};

export const CredentialsEmpty = () => {
  const [, setCredentialDialogOpen] = useAtom(credentialDialog);

  function handleCreate() {
    setCredentialDialogOpen(true);
  }

  return (
    <>
      <EmptyView
        onNew={handleCreate}
        message="You haven't created any workflows yet. Get started by creating your workflow"
      />
    </>
  );
};

export const CredentialsSearch = () => {
  const [params, setParams] = useWorkflowsParams();

  const { searchValue, onSearchChange } = useEntitySearch({
    params: params,
    setParam: setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Workflows"
    />
  );
};

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  const [, setOpenDialog] = useAtom(credentialDialog);

  const handleOnNew = () => {
    setOpenDialog(true);
  };
  return (
    <>
      <EntityHeader
        title="Credentials"
        description="Manage your api keys for different providers"
        onNew={handleOnNew}
        newButtonLable="Add New Key"
        disabled={disabled}
        isCreating={false}
      />
    </>
  );
};

export const CredentialsPagination = () => {
  // TODO: Handle pagination for credentials
  const workflows = useSuspenceWorkflows();
  const [params, setParams] = useWorkflowsParams();

  return (
    <EntityPagination
      disabled={workflows.isFetching}
      totalPages={workflows.data.totalPages}
      page={workflows.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

type CredentialItemType = InferSelectModel<typeof credentials>;

export const CredentialsListItem = ({ item }: { item: CredentialItemType }) => {
  // TODO: Modify the credential entity item
  const removeCredential = useRemoveCredential();

  const handleRemove = async () => {
    removeCredential.mutate({ id: item.id });
  };

  return (
    <EntityItem
      title={item.name}
      href={`/credentials/${item.id}`}
      subtitle={
        <>
          Updated {formatDistanceToNow(item.updatedAt, { addSuffix: true })}{" "}
          &bull; Created
          {formatDistanceToNow(item.createdAt, { addSuffix: true })}
        </>
      }
      image={<ProviderLogo provider={item.provider} />}
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};

export const CredentialsLists = () => {
  const credentials = useSuspenceCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credentials) => credentials.id}
      renderItem={(credential) => {
        return <CredentialsListItem item={credential} />;
      }}
      emptyView={<CredentialsEmpty />}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openDialog, setOpenDialog] = useAtom(credentialDialog);

  return (
    <>
      <CredentialsSheet
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
      {/* Fallback - kept for potential rollback */}
      {/* <CredentialsInputForm
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSubmit={...}
      /> */}
      <EntityContainer
        header={<CredentialsHeader />}
        search={<CredentialsSearch />}
        pagination={<CredentialsPagination />}
      >
        {children}
      </EntityContainer>
    </>
  );
};

const credentialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "API Key is required"),
});

type CredentialSchemaType = z.infer<typeof credentialSchema>;

export const IndivisualCredentialPageContainter = ({ id }: { id: string }) => {
  const { data: singleCredential } = useSuspenceCredential(id);
  // console.log(singleCredential);

  const form = useForm<CredentialSchemaType>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      name: singleCredential.name,
      value: singleCredential.value,
    },
  });

  const onSubmit = (values: CredentialSchemaType) => {
    console.log(values);
    // call your update mutation here
  };

  return (
    <>
      <div>
        <div className="px-12 text-lg pt-12">
          Here you can modify the credentials information
        </div>
        <Card className="w-full h-full px-12 pt-24 border-none shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{singleCredential.name}</CardTitle>
            <div className="flex items-center gap-2">
              <ProviderLogo
                provider={singleCredential.provider}
                size={
                  singleCredential.provider === "OPENAI" ||
                  singleCredential.provider === "OPENROUTER"
                    ? 24
                    : 20
                }
              />
              <span className="text-sm text-muted-foreground">
                {singleCredential.provider ?? "Unknown"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <span>
                    Created:{" "}
                    {new Date(singleCredential.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Updated:{" "}
                    {new Date(singleCredential.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <Button type="submit" className="w-full">
                  Save
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
