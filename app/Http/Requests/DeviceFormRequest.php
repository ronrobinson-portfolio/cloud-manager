<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class DeviceFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $uniqueToUser = Rule::unique('devices');

        // If there is an id then this is an edit
        // so ignore this record for uniqueness
        if ($this->id) {
            $uniqueToUser->ignore($this->id);
        }

        return [
            'name' => [
                'required',
                'max:50',
                $uniqueToUser
            ],
            'ip' => [
                'required',
                'ipv4',
                $uniqueToUser
            ],
            'status_id' => 'required',
            'os'        =>  'required_if:device_type,Computer',
            'service'   =>  'required_if:device_type,AWS Service'
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'ip'     => 'IP',
            'status' => 'status',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     *
     * @return void
     * @throws HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'messsage'         => 'The given data was invalid.',
            'validationErrors' => $validator->errors(),
        ], 422));
    }
}
