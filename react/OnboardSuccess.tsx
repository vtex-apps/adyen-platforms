import type { FC } from 'react'
import React from 'react'
// import { useMutation } from 'react-apollo'
// import { useRuntime } from 'vtex.render-runtime'
import {
  // Input,
  // Box,
  // Dropdown,
  PageBlock,
  Layout,
  PageHeader,
  // Button,
} from 'vtex.styleguide'

// import UPDATE_ACCOUNT_HOLDER from './graphql/UpdateAccountHolder.graphql'

// const initialState = {
//   firstName: '',
//   lastName: '',
//   jobTitle: '',
//   dateOfBirth: '',
//   city: '',
//   country: '',
//   houseNumberOrName: '',
//   postalCode: '',
//   street: '',
//   stateOrProvince: '',
//   email: '',
//   fullPhoneNumber: '',
// }

const OnboardSuccess: FC = () => {
  // const {
  //   route: { queryString },
  // } = useRuntime()

  // const [updateAccountHolder] = useMutation(UPDATE_ACCOUNT_HOLDER)

  // const [formState, setFormState] = useState(initialState)

  // const titles = [
  //   { value: 'Chief Executive Officer', label: 'Chief Executive Officer' },
  //   { value: 'Chief Financial Officer', label: 'Chief Financial Officer' },
  //   { value: 'Chief Operating Officer', label: 'Chief Operating Officer' },
  //   { value: 'President', label: 'President' },
  //   { value: 'Vice President', label: 'Vice President' },
  //   { value: 'Executive President', label: 'Executive President' },
  //   { value: 'Managing Member', label: 'Managing Member' },
  //   { value: 'Partner', label: 'Partner' },
  //   { value: 'Treasurer', label: 'Treasurer' },
  //   { value: 'Director', label: 'Director' },
  //   { value: 'Other', label: 'Other' },
  // ]

  return (
    <Layout pageHeader={<PageHeader title="Adyen Onboarding" />}>
      <PageBlock>
        {/* <div className="ph7">
          <div className="mb5">
            <h3>Signatory Required</h3>
            <p>
              Adyen requires that you provide at least one individual that is
              authorized to act on behalf of or represent the company in their
              relation towards Adyen.
            </p>
          </div>
          <div className="w-40">
            <Box>
              <div className="mb5">
                <Input
                  id="firstName"
                  label="First Name"
                  value={formState.firstName}
                  size="small"
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setFormState({
                      ...formState,
                      firstName: e.currentTarget.value,
                    })
                  }
                />
              </div>
              <div className="mb5">
                <Input
                  id="lastname"
                  label="Last Name"
                  value={formState.lastName}
                  size="small"
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setFormState({
                      ...formState,
                      lastName: e.currentTarget.value,
                    })
                  }
                />
              </div>
              <div className="mb5">
                <Dropdown
                  options={titles}
                  value={formState.jobTitle}
                  size="small"
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setFormState({
                      ...formState,
                      jobTitle: e.currentTarget.value,
                    })
                  }
                  label="Job Title"
                />
              </div>
              <div className="mb5">
                <Input
                  id="dateOfBirth"
                  label="Date of Birth (YYYY-MM-DD)"
                  value={formState.dateOfBirth}
                  size="small"
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setFormState({
                      ...formState,
                      dateOfBirth: e.currentTarget.value,
                    })
                  }
                />
              </div>

              <div className="mb5">
                <Input
                  id="street"
                  label="Street"
                  value={formState.street}
                  size="small"
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setFormState({
                      ...formState,
                      street: e.currentTarget.value,
                    })
                  }
                />
              </div>
              <div className="mb5">
                <Input
                  id="houseNumberOrName"
                  label="House Number"
                  value={formState.houseNumberOrName}
                  size="small"
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setFormState({
                      ...formState,
                      houseNumberOrName: e.currentTarget.value,
                    })
                  }
                />
              </div>
              <div className="mb5">
                <Input
                  id="city"
                  label="City"
                  value={formState.city}
                  size="small"
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setFormState({
                      ...formState,
                      city: e.currentTarget.value,
                    })
                  }
                />
              </div>
              <div className="mb5">
                <Input
                  id="postalCode"
                  label="Postal Code"
                  value={formState.postalCode}
                  size="small"
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setFormState({
                      ...formState,
                      postalCode: e.currentTarget.value,
                    })
                  }
                />
              </div>
              <div className="mb5">
                <Input
                  id="stateOrProvince"
                  label="State"
                  value={formState.stateOrProvince}
                  size="small"
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setFormState({
                      ...formState,
                      stateOrProvince: e.currentTarget.value,
                    })
                  }
                />
              </div>
              <div className="mb5">
                <Input
                  id="country"
                  label="Country"
                  value={formState.country}
                  size="small"
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setFormState({
                      ...formState,
                      country: e.currentTarget.value,
                    })
                  }
                />
              </div>

              <div className="mb5">
                <Input
                  id="email"
                  label="Email"
                  value={formState.email}
                  size="small"
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setFormState({
                      ...formState,
                      email: e.currentTarget.value,
                    })
                  }
                />
              </div>
              <div>
                <Input
                  id="fullPhoneNumber"
                  label="Phone Number (+31612345678)"
                  value={formState.fullPhoneNumber}
                  size="small"
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setFormState({
                      ...formState,
                      fullPhoneNumber: e.currentTarget.value,
                    })
                  }
                />
              </div>
            </Box>
          </div>
        </div>

        <div className="mt5">
          <Button
            onClick={async (_e: any) => {
              console.log('click', {
                accountHolderCode: queryString?.account,
                ...formState,
              })

              const resp = await updateAccountHolder({
                variables: {
                  update: {
                    accountHolderCode: queryString?.account,
                    ...formState,
                  },
                },
              })

              console.log(resp)
            }}
          >
            Submit
          </Button>
        </div> */}
      </PageBlock>
    </Layout>
  )
}

export default OnboardSuccess
